const { createWriteStream, createReadStream } = require('fs')
const fs = require('fs-extra')
const path = require('path')
const { exec } = require('child_process')


const work_path = process.cwd()
console.log(work_path)
let propath = work_path
let conpath = path.resolve(__dirname, '../content')

exports.default = async function (projectName) {
  const { default: {
    prompt
  } } = await import('inquirer')
  const ora = (await import('ora')).default
  console.log(ora)
  try {
    const answers = await prompt([
      {
        type: 'input',
        name: 'project',
        message: '项目名称',
        default: projectName || 'ayu-project',
      },
      {
        type: 'list',
        name: 'type',
        message: '项目类型',
        default: 0,
        choices: [
          { name: 'electron + vue', value: 0 },
        ]        
      },
      {
        type: 'list',
        name: 'gitinore',
        message: '是否创建.gitnore文件',
        default: true,
        choices: [
          { name: 'yes', value: true },
          { name: 'no', value: false },
        ]
      },
      {
        type: 'list',
        name: 'readme',
        message: '是否创建README',
        default: true,
        choices: [
          { name: 'yes', value: true },
          { name: 'no', value: false },
        ]
      }
    ])
    // console.log('答案: ', answers)
    // 创建项目目录
    propath = path.resolve(work_path, `./${answers.project}`)
    await createProjectDir()
    createTsConfig()
    createTsConfigNode()
    createViteConfig()
    // console.log(1)
    if (answers.gitinore) createGitignore()
    if (answers.readme) createREADME()
    createPackage(answers.project)
    switch (answers.type) {
      case 0:
        createElectron()
    }
  } catch (error) {
    console.log(`错误: ${error}`)
  }

  async function createProjectDir () {
    if (fs.existsSync(propath)) {
      const answer = await prompt([
        {
          type: 'list',
          name: 'rm',
          message: '项目文件夹已存在，是否重新生成？',
          default: true,
          choices: [
            { name: 'yes', value: true },
            { name: 'no', value: false },
          ]
        }
      ])
      if (answer.rm) fs.rmSync(propath, { recursive: true })
      else return
    }
    fs.mkdirSync(propath)
  }
  
  /**
   * 初始化electron项目
   */
  function createElectron () {
    // 初始化目录
    mknewdir(path.resolve(propath, './src'))
    mknewdir(path.resolve(propath, './plugins'))
    mknewdir(path.resolve(propath, './resource'))
    // fs.mkdirSync(path.resolve(__dirname, './plugins'))
    // fs.mkdirSync(path.resolve(__dirname, './src'))
    // fs.mkdirSync(path.resolve(__dirname, './src'))
    // console.log(data)
    const loading = ora('正在加载项目依赖')
    loading.start()
    exec('npm install',{ cwd: propath, stdio: "inherit" }, (error, stdout, stderr) => {
      if (error) loading.fail()
      else loading.succeed()
      console.log(error, stdout, stderr)
    })
  }

  /**
   * 创建gitnore
   */
  function createGitignore () {
    const curpath = path.resolve(propath, './.gitignore')
    if (!fs.exists(curpath)) fs.createFileSync(curpath)
    createReadStream(path.resolve(path.resolve(conpath, './.gitinore.txt'))).pipe(createWriteStream(curpath))
  }

  /**
   * 创建package.json
   */
  function createPackage (projectName) {
    const curpath = path.resolve(propath, './package.json')
    if (!fs.exists(curpath)) fs.createFileSync(curpath)
    fs.writeFileSync(curpath, require(path.resolve(conpath, './package')).default(projectName))
  }

  /**
   * 创建README.md
   */
  function createREADME () {
    const curpath = path.resolve(propath, './README.md')
    if (!fs.exists(curpath)) fs.createFileSync(curpath)
    createReadStream(path.resolve(path.resolve(conpath, './README.txt'))).pipe(createWriteStream(curpath))
  }

  /**
   * 创建 tsconfig.json
   */
  function createTsConfig () {
    const curpath = path.resolve(propath, './tsconfig.json')
    if (!fs.exists(curpath)) fs.createFileSync(curpath)
    createReadStream(path.resolve(path.resolve(conpath, './tsconfig.txt'))).pipe(createWriteStream(curpath))
  }

  /**
   * 创建 tsconfig.config.json
   */
  function createTsConfigNode () {
    const curpath = path.resolve(propath, './tsconfig.node.json')
    if (!fs.exists(curpath)) fs.createFileSync(curpath)
    createReadStream(path.resolve(path.resolve(conpath, './tsconfig.node.txt'))).pipe(createWriteStream(curpath))
  }

  /**
   * 创建 vite.config.ts
   */
  function createViteConfig () {
    const curpath = path.resolve(propath, './vite.config.ts')
    if (!fs.exists(curpath)) fs.createFileSync(curpath)
    createReadStream(path.resolve(path.resolve(conpath, './vite.config.txt'))).pipe(createWriteStream(curpath))
  }
}

function mknewdir (path) {
  // console.log(fs.readdirSync(path), 11)
  if (fs.existsSync(path)) fs.rmSync(path, { recursive: true })
  fs.mkdirSync(path)
}