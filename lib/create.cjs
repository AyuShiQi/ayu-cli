const fs = require('fs-extra')
const path = require('path')

// console.log(fs)

exports.default = async function (projectName) {
  const { default: {
    prompt
  } } = await import('inquirer')
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
      }
    ])
    console.log('答案: ', answers)

    switch (answers.type) {
      case 0:
        createElectron()
    }
  } catch (error) {
    console.log(`错误: ${error}`)
  }
}

function createElectron () {
  const data = fs.mkdirSync(path.resolve(__dirname, '../src'))
  // console.log(data)
}