const fs = require('fs');
const path = require('path');
const HandleBars = require('handlebars');
const Mime = require('mime/lite');
const promisify = require('util').promisify;
// import { promisify } from "util";
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/default');
const compress = require('../helper/compress');
const range = require('../helper/range');
const util = require('../helper/util');
const cache = require('../helper/cache');

//  读取模版引擎文件
const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const tpl = HandleBars.compile(source.toString());

module.exports = async function (req, res, filePath) {
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) { // 文件

      // 获取、设置文件的 mime
      const mime = Mime.getType(path.extname(filePath)) || 'text/plain';
      res.setHeader('Content-Type', `${mime}; charset=utf-8`);

      // 检查缓存
      if (cache.isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      // 以流的形式读取文件，返回浏览器显示
      // fs.createReadStream(filePath).pipe(res);
      let rs;

      // 是否只读取文件的部分内容
      const { code, start, end } = range(stats.size, req, res);
      if (code === 200) {
        res.statusCode = 200; // OK
        rs = fs.createReadStream(filePath);
      } else {
        res.statusCode = 206; // Partial Content
        rs = fs.createReadStream(filePath, { start, end });
      }

      // 是否对文件进行压缩处理
      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res);
      }

      // 最终输出到浏览器
      rs.pipe(res);
    } else if (stats.isDirectory()) { // 目录
      // 读取目录
      const files = await readdir(filePath);

      // 设置响应头
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');

      // 以 , 拼接文件和目录名称，输出到浏览器
      // res.end(files.join(','));
      const dir = path.relative(config.root, filePath);
      const data = {
        title: 'file list',
        body: '<p>This is a post about &lt;p&gt; tags</p>',
        dir: dir ? `/${dir}` : '',
        files: files.map((file) => {
          const fileInfo = fs.statSync(path.join(filePath, file));
          return {
            fileName: file,
            path: dir ? `/${dir}` : '',
            size: util.formatBytes(fileInfo.size),
            mtime: new Date(fileInfo.mtime).toLocaleString()
          };
        })
      };
      res.end(tpl(data));
    }
  } catch (ex) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${filePath} is not a file or derectory.`);
  }
};