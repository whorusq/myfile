const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/default');
const route = require('./helper/route');

const server = http.createServer((req, res) => {
  const filePath = path.join(conf.root, req.url);
  route(req, res, filePath);
});

// 启动服务
server.listen(conf.port, conf.hostname, () => {
  let url = `http://${conf.hostname}:${conf.port}`;
  console.log(`Server is running at ${chalk.bold.green(url)}`);
});
