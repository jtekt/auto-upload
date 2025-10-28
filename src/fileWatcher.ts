import chokidar from "chokidar";
import { loadConfig } from "./configHandler";
import { handleFile } from "./utils";
import { processedDirName } from "./constants";
import path from "path";

export let watcher: chokidar.FSWatcher;

export const initWatcher = () => {
  if (watcher) watcher.close();

  const { path: watchedPath, mode } = loadConfig();

  if (mode !== "watch") return;

  const watcherOptions: chokidar.WatchOptions = {
    ignored: path.join(watchedPath, processedDirName),
    persistent: true,

    // depth: 0,
    // ignoreInitial: true,
  };

  watcher = chokidar.watch(watchedPath, watcherOptions);

  watcher.on("add", handleFile);
};
