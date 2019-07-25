const fs = require('fs');
const path = require('path');
const HandleBars = require('handlebars');
const FileIcons = require('file-icons-js');
const Mime = require('mime/lite');
const promisify = require('util').promisify;
// import { promisify } from "util";
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const compress = require('../helper/compress');
const range = require('../helper/range');
const util = require('../helper/util');
const cache = require('../helper/cache');

//  读取模版引擎文件
const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const tpl = HandleBars.compile(source.toString());



module.exports = async function (req, res, filePath, config) {
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
      const fileNames = await readdir(filePath);

      // 设置响应头
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');

      // 以 , 拼接文件和目录名称，输出到浏览器
      // res.end(fileNames.join(','));
      const dir = path.relative(config.root, filePath);
      const fileRelativePath = dir ? `/${dir}` : '';
      let dirs = [];
      let files = fileNames
        .map((file, i) => {
          const fileName = file;
          const fileInfo = fs.statSync(path.join(filePath, fileName));
          let { fileSize, fileMtime, iconClass } = {};
          if (fileInfo.isFile()) {
            fileSize = util.formatBytes(fileInfo.size);
            fileMtime = new Date(fileInfo.mtime).toLocaleString();
            iconClass = FileIcons.getClassWithColor(file) || 'text-icon';
            return { fileName, fileRelativePath, fileSize, fileMtime, iconClass };
          } else {
            dirs.push({ fileName, fileRelativePath, fileSize: '-', fileMtime: '-' });
            return false;
          }
        })
        .filter(f => f !== false);

      // 渲染模版，返回客户端
      res.end(tpl({
        title: fileRelativePath ? fileRelativePath : 'myfile',
        files: [
          ...dirs.sort(compare1),
          ...files.sort(compare1)
        ]
      }));
    }
  } catch (ex) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${filePath} is not a file or derectory.`);
  }
};

/**
 * 根据文件或目录名排序
 */
function compare1(a, b) {
  let nameA = a.fileName.toLowerCase();
  let nameB = b.fileName.toLowerCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}
