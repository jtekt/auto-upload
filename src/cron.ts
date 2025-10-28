import { loadConfig } from "./configHandler";
import cron from "node-cron";
import { handleFile } from "./utils";
import fs from "fs";
import { join as pathJoin } from "path";
async function stopAllJobs() {
  const tasks = cron.getTasks();
  for (const taskId of tasks.keys()) {
    const task = tasks.get(taskId);
    await task?.destroy();
  }
}

export async function initCron() {
  await stopAllJobs();

  const { mode, cron: cronString, path: dirPath } = loadConfig();

  if (mode !== "cron") return;

  const handler = async () => {
    const dirEnts = fs.readdirSync(dirPath, { withFileTypes: true });
    const filePaths = dirEnts
      .filter((e) => e.isFile())
      .map((e) => pathJoin(e.parentPath, e.name));
    for (const file of filePaths) {
      await handleFile(file);
    }
  };

  const opts = { timezone: "Asia/Tokyo" };

  cron.schedule(cronString, handler, opts);
}
