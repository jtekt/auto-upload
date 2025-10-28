import chokidar from "chokidar";
import { loadConfig } from "./configHandler";
import { handleFile } from "./utils";

export let watcher: chokidar.FSWatcher;

export const initWatcher = () => {
  if (watcher) watcher.close();

  const { path, mode } = loadConfig();

  if (mode !== "watch") return;

  const watcherOptions = {
    depth: 0,
    persistent: true,
    // ignoreInitial: true,
  };

  watcher = chokidar.watch(path, watcherOptions);

  watcher.on("add", handleFile);
};
