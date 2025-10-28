import fs from "fs";
import path from "path";
import axios, { AxiosRequestConfig } from "axios";
import FormData from "form-data";
import { parse } from "csv-parse/sync";
import postgres from "postgres";
import { Client } from "minio";
import { HttpSettings, PostgresSettings, S3Settings } from "./settings";
import { loadConfig } from "./configHandler";
import { mainWindow } from "./main";

const processedDirName = `processed`;

export const parseCsv = (path: string) => {
  const fileText = fs.readFileSync(path, { encoding: "utf-8" }).toString();
  const options = {
    skip_empty_lines: true,
    trim: true,
    columns: true,
    cast: true,
    bom: true,
  };
  return parse(fileText, options);
};

export const postFile = async (path: string, config: HttpSettings) => {
  const { url, field, fields, headers } = config;

  const options: AxiosRequestConfig = {
    headers: {},
  };
  const form = new FormData();
  form.append(field, fs.createReadStream(path));

  for (const { key, value } of fields) form.append(key, value);
  for (const { key, value } of headers) options.headers[key] = value;

  return axios.post(url, form, options);
};

export const s3Upload = async (
  originalFilePath: string,
  config: S3Settings
) => {
  const { endPoint, port, useSSL, bucket, secretKey, accessKey } = config;
  const minioClient = new Client({
    endPoint,
    accessKey,
    secretKey,
    port,
    useSSL,
  });

  const { base } = path.parse(originalFilePath);

  return minioClient.fPutObject(bucket, base, originalFilePath);
};

export const postJson = async (json: any[], config: HttpSettings) => {
  const { url } = config;
  return axios.post(url, json);
};

export const moveFile = (originalFilePath: string) => {
  const { base, dir } = path.parse(originalFilePath);
  const newDir = path.join(dir, processedDirName);
  if (!fs.existsSync(newDir)) fs.mkdirSync(newDir);
  const newPath = path.join(newDir, base);
  fs.renameSync(originalFilePath, newPath);
};

export const importToPostgres = async (
  records: any[],
  config: PostgresSettings
) => {
  const { host, port, username, password, database, table, ssl } = config;
  const sql = postgres({
    host,
    port,
    username,
    password,
    database,
    ssl,
  });
  await sql`INSERT INTO ${sql(table)} ${sql(records)}`;
};

export const handleFile = async (filePath: string) => {
  const {
    moveProcessed = false,
    parser = null,
    target = "http",
    postgres,
    http,
    s3,
  } = loadConfig();

  const uiFeedbackPayload = {
    path: filePath,
    time: new Date(),
    success: false,
  };

  try {
    if (parser) {
      const json = parseCsv(filePath);
      if (target === "postgres") await importToPostgres(json, postgres);
      if (target === "http") await postJson(json, http);
    } else {
      if (target === "s3") await s3Upload(filePath, s3);
      else await postFile(filePath, http);
    }

    if (moveProcessed) moveFile(filePath);

    uiFeedbackPayload.success = true;
  } catch (error) {
    console.error(error);
    uiFeedbackPayload.success = false;
  } finally {
    // PROBLEM: how to talk to the mainWindow here?
    mainWindow.webContents.send("post", uiFeedbackPayload);
  }
};
