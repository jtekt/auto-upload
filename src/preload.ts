// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // Main to renderer
  // I.e. Allowing the Vue.js front-end to subscribe / react to those events
  onConfig: (cb: Function) => ipcRenderer.on("config", (_, value) => cb(value)),
  onPost: (cb: Function) => ipcRenderer.on("post", (_, value) => cb(value)),

  // Renderer to main
  // I.e. Allowing the Vue.js front-end to use those functions to run these functions
  setConfig: (config: any) => ipcRenderer.send("set-config", config),
  getConfig: (config: any) => ipcRenderer.send("get-config", config),
});
