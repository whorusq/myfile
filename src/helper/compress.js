const { createGzip, createDeflate } = require('zlib');

/**
 * 压缩文件，此处以 gzip 和 deflate 为例
 */
module.exports = (rs, req, res) => {
  const acceptEncoding = req.headers['accept-encoding'];
  if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {
    return rs;
  }
  if (acceptEncoding.match(/\bgzip\b/)) { // 采用 Gzip 压缩
    res.setHeader('Content-Encoding', 'gzip');
    return rs.pipe(createGzip());
  } else if (acceptEncoding.match(/\bdeflate\b/)) { // 采用 Deflate 压缩
    res.setHeader('Content-Encoding', 'deflate');
    return rs.pipe(createDeflate());
  }
};
