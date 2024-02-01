import YAML from "yaml"
import fs from "fs"
import { app } from "electron"
import path from "path"
import { watcher } from "./fileWatcher"

const configPath = path.join(app.getPath("userData"), "config.yml")

export const loadConfig = () => {
  try {
    const file = fs.readFileSync(configPath, "utf8")
    return YAML.parse(file)
  } catch (error) {
    return {
      path: "test",
      url: "http://localhost:8080/file",
      field: "file",
    }
  }
}

export const writeConfig = async (config: any) => {
  const { path: oldPath } = loadConfig()
  await watcher.unwatch(oldPath)
  const yml = YAML.stringify(config)
  fs.writeFileSync(configPath, yml)
  const { path: newPath } = loadConfig()
  await watcher.add(newPath)
  console.log({ oldPath, newPath })
}
