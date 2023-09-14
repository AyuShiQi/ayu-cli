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
   * 初始化electron项目
   */
  function createElectron () {
    // 初始化目录
    createSrc()
    createPlugins()
    mknewdir(path.resolve(propath, './resource'))
    createMain ()

    // console.log(data)
    // 最后一步，加载项目依赖
    // const loading = ora('正在加载项目依赖')
    // loading.start()
    // exec('npm install',{ cwd: propath, stdio: "inherit" }, (error, stdout, stderr) => {
    //   if (error) loading.fail()
    //   else loading.succeed()
    //   console.log(error, stdout, stderr)
    // })

    function createSrc () {
      const curPath = path.resolve(propath, './src')
      mknewdir(curPath)
      mknewdir(path.resolve(curPath, './common'))
      mknewdir(path.resolve(curPath, './main'))
      mknewdir(path.resolve(curPath, './model'))
      mknewdir(path.resolve(curPath, './renderer'))
      mknewdir(path.resolve(curPath, './renderer/assets'))
      mknewdir(path.resolve(curPath, './renderer/assets/icon'))
      mknewdir(path.resolve(curPath, './renderer/components'))
      mknewdir(path.resolve(curPath, './renderer/store'))
      mknewdir(path.resolve(curPath, './renderer/Window'))

      // 创建vite-env.d.ts
      createFileAndWrite(path.resolve(curPath, './vite-env.d.ts'), path.resolve(conpath, './vite-env.d.txt'))
      // 创建main.ts
      createFileAndWrite(path.resolve(curPath, './main.ts'), path.resolve(conpath, './main.txt'))
      // 创建APP.vue
      createFileAndWrite(path.resolve(curPath, './App.ts'), path.resolve(conpath, './App.txt'))
      // 创建vue.svg
      createFileAndWrite(path.resolve(curPath, './assets/vue.svg'), path.resolve(conpath, './vue.txt'))
      // 创建style.css
      createFileAndWrite(path.resolve(curPath, './assets/style.css'), path.resolve(conpath, './style.txt'))
      // 创建HelloWord.vue
      createFileAndWrite(path.resolve(curPath, './components/HelloWord.vue'), path.resolve(conpath, './HelloWord.txt'))
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
      const curPath = path.resolve(propath, './main')
      mknewdir(curPath)
      // 创建CustomScheme.ts
      createFileAndWrite(path.resolve(curPath, './CustomScheme.ts'), path.resolve(conpath, './CustomScheme.txt'))
      // 创建mainEntry.ts
      createFileAndWrite(path.resolve(curPath, './mainEntry.ts'), path.resolve(conpath, './mainEntry.txt'))
    }
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

function mknewdir (path) {
  // console.log(fs.readdirSync(path), 11)
  if (fs.existsSync(path)) fs.rmSync(path, { recursive: true })
  fs.mkdirSync(path)
}

function createFileAndWrite (create_path, read_path) {
  if (!fs.exists(create_path)) fs.createFileSync(create_path)
  createReadStream(path.resolve(read_path).pipe(createWriteStream(create_path)))
}