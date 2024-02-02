import chokidar from "chokidar"
import fs from "fs"
import axios from "axios"
import FormData from "form-data"
import { loadConfig } from "./configHandler"
import path from "path"
export let watcher: chokidar.FSWatcher

const uploadedDirName = `uploaded`

const moveFile = (originalFilePath: string) => {
  const { base, dir } = path.parse(originalFilePath)
  const newDir = path.join(dir, uploadedDirName)
  if (!fs.existsSync(newDir)) fs.mkdirSync(newDir)
  const newPath = path.join(newDir, base)
  fs.renameSync(originalFilePath, newPath)
}

export const initWatcher = (mainWindow: any) => {
  const { path } = loadConfig()
  watcher = chokidar.watch(path, {
    depth: 0,
    persistent: true,
    // ignoreInitial: true,
  })
  watcher.on("add", async (path) => {
    const { url, field = "file", moveUploads = false } = loadConfig()
    const webContentsPayload = {
      path,
      url,
      field,
      time: new Date(),
    }
    try {
      const form = new FormData()
      form.append(field, fs.createReadStream(path))
      await axios.post(url, form)
      if (moveUploads) moveFile(path)
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
