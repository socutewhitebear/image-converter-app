const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  dialog,
  shell,
} = require("electron");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const os = require("os");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    contextIsolation: true,
    enableRemoteModule: false,
  });

  win.loadFile("renderer.html");

  const isWindows = process.platform === "win32";
  const osVersion = os.release();
  const arch = os.arch();
  const platform = os.platform();
  const chromium = process.versions["chrome"];
  const electronVersion = process.versions["electron"];

  win.webContents.on("context-menu", (event, params) => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Inspect Element",
        click: () => {
          win.webContents.inspectElement(params.x, params.y);
        },
      },
    ]);

    contextMenu.popup();
  });

  const menu = Menu.buildFromTemplate([
    {
      label: "View",
      submenu: [
        {
          label: "Toggle DevTools",
          accelerator:
            process.platform === "darwin" ? "Cmd+Option+I" : "Ctrl+Shift+I",
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.toggleDevTools();
            }
          },
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About",
          click: () => {
            const sourceLink =
              "https://github.com/socutewhitebear/image-converter-app";
            dialog
              .showMessageBox(win, {
                type: "info",
                title: "About Image Converter",
                message: "Image Converter App",
                detail: `Stable v1.0.0
Host: ${os.hostname()} ${arch} (${platform})
Build Override: N/A 
Windows 11 64-bit (${osVersion})
Electron: ${electronVersion}
Chromium: ${chromium}

Source Code: ${sourceLink}`,
                buttons: ["Open Source Code", "Close"],
                defaultId: 0,
                cancelId: 1,
              })
              .then(({ response }) => {
                if (response === 0) {
                  shell.openExternal(sourceLink);
                }
              });
          },
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);

  ipcMain.handle(
    "convert-image",
    async (event, fileBuffer, originalFileName, outputFormat) => {
      const downloadsPath = path.join(os.homedir(), "Downloads");
      if (!fs.existsSync(downloadsPath)) fs.mkdirSync(downloadsPath);

      const outputFileName = `${
        path.parse(originalFileName).name
      }.${outputFormat}`;
      const outputPath = path.join(downloadsPath, outputFileName);

      try {
        await sharp(fileBuffer)
          [outputFormat]({
            quality: 100,
            lossless: outputFormat === "webp" || outputFormat === "avif",
          })
          .toFile(outputPath);

        return { success: true, outputPath };
      } catch (err) {
        console.error("Conversion failed:", err);
        return { success: false, error: err.message };
      }
    }
  );
};

app.whenReady().then(createWindow);
