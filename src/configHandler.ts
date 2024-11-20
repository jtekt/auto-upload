import fs from "node:fs"
import { app, safeStorage } from "electron"
import path from "path"
import { watcher } from "./fileWatcher"
import { defaultsettings, Settings } from "./config"

const configPath = path.join(app.getPath("userData"), "config")

export const loadConfig = () => {
  try {
    const file = fs.readFileSync(configPath)
    const decryptedConfigString = safeStorage.decryptString(file)
    const config = JSON.parse(decryptedConfigString)
    return { ...defaultsettings, ...config }
  } catch (error) {
    return defaultsettings
  }
}

export const writeConfig = async (config: Settings) => {
  const { path: oldPath } = loadConfig()
  watcher.unwatch(oldPath)
  const configString = JSON.stringify(config)
  const encryptedConfigString = safeStorage.encryptString(configString)

  // @ts-ignore
  fs.writeFileSync(configPath, encryptedConfigString)

  const { path: newPath } = loadConfig()
  watcher.add(newPath)
}
