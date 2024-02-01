// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
  // Main to renderer
  onPost: (callback: Function) =>
    ipcRenderer.on("post", (event, value) => callback(value)),
  onConfig: (callback: Function) =>
    ipcRenderer.on("config", (event, value) => callback(value)),

  // Renderer to main
  setConfig: (config: any) => ipcRenderer.send("set-config", config),
  getConfig: (config: any) => ipcRenderer.send("get-config", config),
})
