const fs = require('fs-extra')
const path = require('path')

/**
 * 创建新的文件夹
 * @param {string} path 
 */
exports.mknewdir = function mknewdir (path) {
  // console.log(fs.readdirSync(path), 11)
  if (fs.existsSync(path)) fs.rmSync(path, { recursive: true })
  fs.mkdirSync(path)
}

/**
 * 复制文件
 * @param {string} create_path 创建路径
 * @param {string} read_path 读取路径 
 */
exports.createFileAndWrite = function createFileAndWrite (create_path, read_path) {
  if (!fs.exists(create_path)) fs.createFileSync(create_path)
  fs.createReadStream(path.resolve(read_path)).pipe(fs.createWriteStream(create_path))
}