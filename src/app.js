const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/default');
const route = require('./helper/route');
const openUrl = require('./helper/openUrl');

class Server {

  // 合并用户自定义参数
  constructor(config) {
    this.conf = { ...conf, ...config };
  }

  // 启动服务
  start() {
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url);
      route(req, res, filePath, this.conf);
    });
    server.listen(this.conf.port, this.conf.hostname, () => {
      let url = `http://${this.conf.hostname}:${this.conf.port}`;
      if (this.conf.auto) {
        // 使用系统默认浏览器打开服务地址
        openUrl(url);
      }
      console.log(`Server is running at ${chalk.bold.green(url)}`);
    });
  }
}

module.exports = Server;
