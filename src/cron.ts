import { loadConfig } from "./configHandler";
import cron from "node-cron";
import { handleFile } from "./utils";
import fs from "fs";
import path from "path";
import { processedDirName } from "./constants";

async function stopAllJobs() {
  const tasks = cron.getTasks();
  for (const taskId of tasks.keys()) {
    const task = tasks.get(taskId);
    await task?.destroy();
  }
}

function getAllFiles(dirPath: string, arrayOfFiles: string[]) {
  arrayOfFiles = arrayOfFiles || [];

  const files = fs.readdirSync(dirPath).filter((f) => f !== processedDirName);

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

export async function initCron() {
  await stopAllJobs();

  const { mode, cron: cronString, path: dirPath } = loadConfig();

  if (mode !== "cron") return;

  const handler = async () => {
    const filePaths = getAllFiles(dirPath, []);
    for (const file of filePaths) {
      await handleFile(file);
    }
  };

  const opts = { timezone: "Asia/Tokyo" };

  cron.schedule(cronString, handler, opts);
}
