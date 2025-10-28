import fs from "node:fs";
import { app, safeStorage } from "electron";
import path from "path";
import { initWatcher } from "./fileWatcher";
import { defaultsettings, Settings } from "./settings";
import { initCron } from "./cron";

const configPath = path.join(app.getPath("userData"), "config");

export const loadConfig = () => {
  try {
    const file = fs.readFileSync(configPath);
    const decryptedConfigString = safeStorage.decryptString(file);
    const config = JSON.parse(decryptedConfigString);
    return { ...defaultsettings, ...config };
  } catch (error) {
    return defaultsettings;
  }
};

export const writeConfig = async (config: Settings) => {
  // TODO: consider simply recreating the watcher
  // PROBLEM: do not have access to mainWindow

  // const { path: oldPath } = loadConfig();
  // watcher.unwatch(oldPath);

  const configString = JSON.stringify(config);
  const encryptedConfigString = safeStorage.encryptString(configString);
  fs.writeFileSync(configPath, encryptedConfigString);

  // const { path: newPath } = loadConfig();

  // // TODO: deal with timers
  // watcher.add(newPath);
  initWatcher();
  initCron();
};
