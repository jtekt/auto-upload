import chokidar from "chokidar"
import fs from "fs"
import axios from "axios"
import FormData from "form-data"

export const initWatcher = (config: any, mainWindow: any) => {
  const { path, url, field = "file" } = config

  console.log(`[Chokidar] Watching ${path}`)
  chokidar.watch(path).on("add", async (path) => {
    try {
      const form = new FormData()
      form.append(field, fs.createReadStream(path))
      const { data } = await axios.post(url, form)
      mainWindow.webContents.send("post", path)
    } catch (error) {
      console.error(error)
    }
  })
}
