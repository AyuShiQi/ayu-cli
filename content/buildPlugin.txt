import path from "path";
import fs from "fs";

class BuildObj {
  //编译主进程代码
  buildMain() {
    require("esbuild").buildSync({
      entryPoints: ["./src/main/mainEntry.ts"],
      bundle: true,
      platform: "node",
      minify: true,
      outfile: "./dist/mainEntry.js",
      external: ["electron"],
    });
  }
  //为生产环境准备package.json
  preparePackageJson() {
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
    localPkgJson.main = "mainEntry.js";
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.devDependencies = { electron: electronConfig };
    let tarJsonPath = path.join(process.cwd(), "dist", "package.json");
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
    fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"));
  }
  //使用electron-builder制成安装包
  buildInstaller() {
    let options = {
      config: {
        directories: {
          output: path.join(process.cwd(), "release"),
          app: path.join(process.cwd(), "dist"),
        },
        files: ["**"],
        extends: null,
        productName: "JueJin",
        appId: "com.juejin.desktop",
        asar: true,
        nsis: {
          oneClick: false, // 是否一键安装
          perMachine: true,
          allowToChangeInstallationDirectory: true, // 允许安装修改目录
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单目标 
          shortcutName: "juejinDesktop", // 图标名称
        },
        publish: [{ provider: "generic", url: "http://localhost:5500/" }],
      },
      project: process.cwd(),
    };
    return require("electron-builder").build(options);
  }
}

/**
 * 构建项目插件
 * @returns 插件对象
 */
export let buildPlugin = () => {
  return {
    name: "build-plugin",
    closeBundle: () => {
      let buildObj = new BuildObj();
      buildObj.buildMain();
      buildObj.preparePackageJson();
      buildObj.buildInstaller();
    },
  };
};