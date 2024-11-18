import YAML from "yaml"
import fs from "fs"
import { app, safeStorage } from "electron"
import path from "path"
import { watcher } from "./fileWatcher"
import { defaultsettings, Settings } from "./config"

const configPath = path.join(app.getPath("userData"), "config")

export const loadConfig = () => {
  try {
    // const file = fs.readFileSync(configPath, "utf8")
    // const config = YAML.parse(file)
    const file = fs.readFileSync(configPath)
    const decryptedConfigString = safeStorage.decryptString(file)
    const config = JSON.parse(decryptedConfigString)
    return { ...defaultsettings, ...config }
  } catch (error) {
    return defaultsettings
  }
}

export const writeConfig = async (config: Settings) => {
  // TODO: fix path update
  const { path: oldPath } = loadConfig()
  watcher.unwatch(oldPath)
  // const yml = YAML.stringify(config)
  // fs.writeFileSync(configPath, yml)
  const configString = JSON.stringify(config)
  const encryptedConfigString = safeStorage.encryptString(configString)

  fs.writeFileSync(configPath, encryptedConfigString)
  const newConfig = loadConfig()
}
