#! /usr/bin/env node

const program = require('commander')

program
  .version(require('../package.json').version, '-v, --version')
  .description('查看当前版本信息')

program
  .command('create [project-name]')
  .description('创建electron项目')
  .action((projectName) => {
    require('../lib/create.cjs').default(projectName)
  })

// 解析传入指令
program.parse(process.argv)