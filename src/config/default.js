module.exports = {
  hostname: '127.0.0.1',
  port: 3333,
  root: process.cwd(),
  // 压缩
  compress: /\.(html|js|css|md)/,
  // 缓存
  cache: {
    maxAge: 600,
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
};
