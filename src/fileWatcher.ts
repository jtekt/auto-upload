import fs from "fs"
import path from "path"
import chokidar from "chokidar"
import axios from "axios"
import FormData from "form-data"
import { loadConfig } from "./configHandler"
import { parse } from "csv-parse/sync"
import postgres from "postgres"

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
const postFile = async (path: string, url: string, field: string) => {
  const form = new FormData()
  form.append(field, fs.createReadStream(path))
  return axios.post(url, form)
}

const postJson = async (url: string, json: any) => {
  return axios.post(url, json)
}

const moveFile = (originalFilePath: string) => {
  const { base, dir } = path.parse(originalFilePath)
  const newDir = path.join(dir, processedDirName)
  if (!fs.existsSync(newDir)) fs.mkdirSync(newDir)
  const newPath = path.join(newDir, base)
  fs.renameSync(originalFilePath, newPath)
}

const importToPostgres = async (
  connectionString: string,
  table: string,
  records: any
) => {
  const sql = postgres(connectionString)
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
    const {
      url,
      field = "file",
      table,
      moveProcessed = false,
      parser = null,
      target = "http",
    } = loadConfig()

    const uiFeedbackPayload = {
      path,
      time: new Date(),
      success: false,
    }

    try {
      if (parser) {
        const json = parseCsv(path)
        // TODO: table name from config
        if (target === "postgres") await importToPostgres(url, table, json)
        if (target === "http") await postJson(url, json)
        // TODO: Postgres
      } else await postFile(path, url, field)

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
