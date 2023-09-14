const fs = require('fs-extra')
const path = require('path')
const { createFileAndWrite } = require('./utils')
const { execSync } = require('child_process')

const work_path = process.cwd()
let propath = work_path
let conpath = path.resolve(__dirname, '../content')

exports.default = async function (projectName) {
  // 依赖加载
  const { default: {
    prompt
  } } = await import('inquirer')
  const ora = (await import('ora')).default
  const chalk = (await import('chalk')).default

  console.log(chalk.blue('欢迎使用ayu-cli创建项目板块'))
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
    switch (answers.type) {
      case 0:
        conpath = path.resolve(__dirname, '../content/electron')
        createTsConfig()
        createTsConfigNode()
        createViteConfig()
        createPackage(answers.project)
        if (answers.readme) createREADME()
        if (answers.gitinore) createGitignore()
        require('./electron/createTsVue')(propath, conpath)
    }

    // 最后一步，加载项目依赖
    const loading = ora('加载项目依赖')
    loading.start()
    const err = execSync('npm install',{ cwd: propath, stdio: "inherit" })
    if (err) loading.fail()
    else loading.succeed()
    // end
    console.log(`${chalk.blue('cd')} ${answers.project}`)
  } catch (error) {
    console.log(`错误: ${error}`)
  }

  /**
   * 新建项目文件夹
   */
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
   * 创建gitnore
   */
  function createGitignore () {
    createFileAndWrite(path.resolve(propath, './.gitignore'), path.resolve(conpath, './.gitinore.txt'))
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
    createFileAndWrite(curpath, path.resolve(conpath, './README.txt'))
  }

  /**
   * 创建 tsconfig.json
   */
  function createTsConfig () {
    const curpath = path.resolve(propath, './tsconfig.json')
    createFileAndWrite(curpath, path.resolve(conpath, './tsconfig.txt'))
  }

  /**
   * 创建 tsconfig.config.json
   */
  function createTsConfigNode () {
    const curpath = path.resolve(propath, './tsconfig.node.json')
    createFileAndWrite(curpath, path.resolve(conpath, './tsconfig.node.txt'))
  }

  /**
   * 创建 vite.config.ts
   */
  function createViteConfig () {
    const curpath = path.resolve(propath, './vite.config.ts')
    createFileAndWrite(curpath, path.resolve(conpath, './vite.config.txt'))
  }
}