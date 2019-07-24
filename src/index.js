const yargs = require('yargs');
const Server = require('./app');

// 处理命令行参数
// https://github.com/yargs/yargs/blob/HEAD/docs/examples.md
const argv = yargs.usage('Usage: myfile [options]')
  .alias('p', 'port')
  .describe('p', 'custmize the server port(default: 3333)')
  .alias('d', 'dir')
  .alias('d', 'root')
  .describe('d', 'custmize the root path(default: process.cwd())')
  .example('myfile -p 6666')
  .example('myfile -d /usr -p 6666')
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help')
  .argv;

// 启动服务
new Server(argv).start();
