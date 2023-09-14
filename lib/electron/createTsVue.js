const path = require('path')
const { mknewdir, createFileAndWrite } = require('../utils')

/**
 * 初始化electron项目
 * @param {string} propath 项目文件夹路径
 * @param {string} conpath 内容文件夹路径
 */
module.exports = function createElectron (propath, conpath) {
  // 初始化package.json
  // 初始化目录
  createSrc()
  createPlugins()
  mknewdir(path.resolve(propath, './resource'))

  // console.log(data)

  function createSrc () {
    const curPath = path.resolve(propath, './src')
    mknewdir(curPath)
    mknewdir(path.resolve(curPath, './common'))
    mknewdir(path.resolve(curPath, './model'))
    mknewdir(path.resolve(curPath, './renderer'))
    mknewdir(path.resolve(curPath, './renderer/assets'))
    mknewdir(path.resolve(curPath, './renderer/assets/icon'))
    mknewdir(path.resolve(curPath, './renderer/components'))
    mknewdir(path.resolve(curPath, './renderer/store'))
    mknewdir(path.resolve(curPath, './renderer/Window'))
    createMain()

    // 创建vite-env.d.ts
    createFileAndWrite(path.resolve(curPath, './vite-env.d.ts'), path.resolve(conpath, './vite-env.d.txt'))
    // 创建main.ts
    createFileAndWrite(path.resolve(curPath, './main.ts'), path.resolve(conpath, './main.txt'))
    // 创建APP.vue
    createFileAndWrite(path.resolve(curPath, './App.vue'), path.resolve(conpath, './App.txt'))
    // 创建vue.svg
    createFileAndWrite(path.resolve(curPath, './renderer/assets/vue.svg'), path.resolve(conpath, './vue.svg'))
    // 创建style.css
    createFileAndWrite(path.resolve(curPath, './renderer/assets/style.css'), path.resolve(conpath, './style.txt'))
    // 创建HelloWord.vue
    createFileAndWrite(path.resolve(curPath, './renderer/components/HelloWord.vue'), path.resolve(conpath, './HelloWord.txt'))
  }

  function createPlugins () {
    const curPath = path.resolve(propath, './plugins')
    mknewdir(curPath)
    // 创建dev-plugin
    createFileAndWrite(path.resolve(curPath, './devPlugin.ts'), path.resolve(conpath, './devPlugin.txt'))
    // 创建build-plugin
    createFileAndWrite(path.resolve(curPath, './buildPlugin.ts'), path.resolve(conpath, './buildPlugin.txt'))
  }

  function createMain () {
    const curPath = path.resolve(propath, './src/main')
    mknewdir(curPath)
    // 创建CustomScheme.ts
    createFileAndWrite(path.resolve(curPath, './CustomScheme.ts'), path.resolve(conpath, './CustomScheme.txt'))
    // 创建mainEntry.ts
    createFileAndWrite(path.resolve(curPath, './mainEntry.ts'), path.resolve(conpath, './mainEntry.txt'))
  }
}