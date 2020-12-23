const path = require("path");
const fs = require("fs");
const os = require("os");
const open = require("open");

const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");

// const fullscreenScreenshot = require("./screenshot");

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;

if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
  app.quit();
}

// the directory where screenshots are stored
const shotzDir = path.join(os.homedir(), "Shotz");

let win,
  count = 0;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 250,
    webPreferences: {
      nodeIntegration: true,
    },
    resizable: false,
  });

  win.removeMenu();

  // and load the index.html of the app.
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle("save-data", async (event, base64img, folder) => {
  // ensuring the screenshot directory exists
  if (!fs.existsSync(shotzDir)) fs.mkdirSync(shotzDir);

  console.log(folder);
  let shotDir = path.join(shotzDir, String(folder));

  // creating the directory for this series of screenshots
  if (!fs.existsSync(shotDir)) {
    count = 0;
    fs.mkdirSync(shotDir);
  }

  let shot = path.join(shotDir, `shot${count}.jpeg`);

  const base64Data = base64img.replace(/^data:image\/jpeg;base64,/, "");
  fs.writeFile(shot, base64Data, "base64", (err) => {
    if (err) throw err;
    console.log("Image Saved");
    count++;
  });
});

ipcMain.handle("open-base-dir", (event) => {
  // ensuring the screenshot directory exists
  if (!fs.existsSync(shotzDir)) fs.mkdirSync(shotzDir);

  open(shotzDir);
});
