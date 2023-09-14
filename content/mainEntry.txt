import { app, BrowserWindow } from "electron";
import { CustomScheme } from "./CustomScheme";
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
let mainWindow: BrowserWindow;

/**
 * app为electron全局对象，当electron初始化好后，触发ready事件
 */
app.whenReady().then(() => {
  let config = {
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true,
    },
  };
  // 创建一个主窗口
  mainWindow = new BrowserWindow(config);
  // 开发环境
  // 2保存的是进程的开启端口
  if (process.argv[2]) {
    console.log(process.argv)
    mainWindow.loadURL(process.argv[2]);
    // devTools
    mainWindow.webContents.openDevTools({ mode: "undocked" });
  // 生产环境
  } else {
    CustomScheme.registerScheme();
    // 这个用来加载本地文件
    // mainWindow.loadFile()
    // 这个用来加载一个外链地址
    mainWindow.loadURL(`app://index.html`);
  }
});