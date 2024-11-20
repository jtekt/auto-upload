import fs from "fs"
import path from "path"
import chokidar from "chokidar"
import axios, { AxiosHeaders } from "axios"
import FormData from "form-data"
import { loadConfig } from "./configHandler"
import { parse } from "csv-parse/sync"
import postgres from "postgres"
import { HttpSettings, PostgresSettings, S3Settings } from "./config"
import { Client } from "minio"

export let watcher: chokidar.FSWatcher

const processedDirName = `processed`

const parseCsv = (path: string) => {
  const fileText = fs.readFileSync(path, { encoding: "utf-8" }).toString()
  const options = {
    skip_empty_lines: true,
    trim: true,
    columns: true,
    cast: true,
    bom: true,
  }
  return parse(fileText, options)
}
const postFile = async (path: string, config: HttpSettings) => {
  const { url, field, fields, headers } = config

  // TODO: typing
  const options: any = {
    headers: {},
  }
  const form = new FormData()
  form.append(field, fs.createReadStream(path))

  for (const { key, value } of fields) form.append(key, value)
  for (const { key, value } of headers) options.headers[key] = value

  return axios.post(url, form, options)
}

const s3Upload = async (originalFilePath: string, config: S3Settings) => {
  const { endPoint, port, useSSL, bucket, secretKey, accessKey } = config
  const minioClient = new Client({
    endPoint,
    accessKey,
    secretKey,
    port,
    useSSL,
  })

  const { base } = path.parse(originalFilePath)

  return minioClient.fPutObject(bucket, base, originalFilePath)
}

const postJson = async (json: any[], config: HttpSettings) => {
  const { url } = config
  return axios.post(url, json)
}

const moveFile = (originalFilePath: string) => {
  const { base, dir } = path.parse(originalFilePath)
  const newDir = path.join(dir, processedDirName)
  if (!fs.existsSync(newDir)) fs.mkdirSync(newDir)
  const newPath = path.join(newDir, base)
  fs.renameSync(originalFilePath, newPath)
}

const importToPostgres = async (records: any[], config: PostgresSettings) => {
  const { host, port, username, password, database, table, ssl } = config
  const sql = postgres({
    host,
    port,
    username,
    password,
    database,
    ssl,
  })
  await sql`INSERT INTO ${sql(table)} ${sql(records)}`
}

export const initWatcher = (mainWindow: any) => {
  const { path } = loadConfig()

  const watcherOptions = {
    depth: 0,
    persistent: true,
    // ignoreInitial: true,
  }

  watcher = chokidar.watch(path, watcherOptions)

  watcher.on("add", async (path) => {
    const config = loadConfig()
    const { moveProcessed = false, parser = null, target = "http" } = config

    const uiFeedbackPayload = {
      path,
      time: new Date(),
      success: false,
    }

    try {
      if (parser) {
        const json = parseCsv(path)
        // TODO: table name from config
        if (target === "postgres") await importToPostgres(json, config.postgres)
        if (target === "http") await postJson(json, config.http)
        // TODO: Postgres
      } else {
        if (target === "s3") await s3Upload(path, config.s3)
        else await postFile(path, config.http)
      }

      if (moveProcessed) moveFile(path)

      uiFeedbackPayload.success = true
    } catch (error) {
      console.error(error)
      uiFeedbackPayload.success = false
    } finally {
      mainWindow.webContents.send("post", uiFeedbackPayload)
    }
  })
}
