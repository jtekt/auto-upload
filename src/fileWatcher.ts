import chokidar from "chokidar"
import fs from "fs"
import axios from "axios"
import FormData from "form-data"
import { loadConfig } from "./configHandler"

export let watcher: chokidar.FSWatcher

export const initWatcher = (mainWindow: any) => {
  const { path } = loadConfig()
  watcher = chokidar.watch(path, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  })
  watcher.on("add", async (path) => {
    try {
      const { url, field = "file" } = loadConfig()
      const webContentsPayload = {
        path,
        url,
        field,
        time: new Date(),
      }
      const form = new FormData()
      form.append(field, fs.createReadStream(path))
      await axios.post(url, form)
      mainWindow.webContents.send("post", {
        ...webContentsPayload,
        success: true,
      })
    } catch (error) {
      console.error(error)
      mainWindow.webContents.send("post", {
        ...webContentsPayload,
        success: false,
      })
    }
  })
}
