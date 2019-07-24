/**
 * 客户端请求范围处理
 * 测试：curl -i -r 0-10 http://127.0.0.1:3001/src/helper/route.js
 */
module.exports = (totalSize, req, res) => {
  const range = req.headers['range'];
  if (!range) {
    return { code: 200 };
  }

  // 计算范围
  const size = range.match(/bytes=(\d*)-(\d*)/);
  const end = size[2] || totalSize - 1;
  const start = size[1] || totalSize - end;

  //
  if (start > end || start < 0 || end > totalSize) {
    return { code: 200 };
  }

  //
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`);
  res.setHeader('Content-Length', end - start);
  return {
    code: 206,
    start: parseInt(start, 10),
    end: parseInt(end, 10)
  };
};
