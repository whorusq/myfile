const { exec } = require('child_process');

/**
 * 使用系统默认浏览器自动打开指定的 url
 */
module.exports = url => {
  switch (process.platform) {
  case 'darwin':
    exec(`open ${url}`);
    break;
  case 'win32':
    exec(`start ${url}`);
    break;
  default:
    break;
  }
};
