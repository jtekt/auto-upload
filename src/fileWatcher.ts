import chokidar from "chokidar"
import YAML from "yaml"
import fs from "fs"
import axios from "axios"
import FormData from "form-data"

export const initWatcher = () => {
  const file = fs.readFileSync("./config/config.yml", "utf8")
  const { path, url, field } = YAML.parse(file)

  console.log(`[Chokidar] Wathing ${path}`)
  chokidar.watch(path).on("add", async (path) => {
    try {
      const form = new FormData()
      form.append(field, fs.createReadStream(path))
      await axios.post(url, form)
    } catch (error) {
      console.error(error)
    }
  })
}
