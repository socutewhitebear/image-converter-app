const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("converter", {
  convertImage: (filePath, fileName, format) =>
    ipcRenderer.invoke("convert-image", filePath, fileName, format),
});
