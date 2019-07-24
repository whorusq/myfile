const { cache } = require('../config/default');

function refreshRes(stats, res) {

  const { maxAge, expires, cacheControl, lastModified, etag } = cache;

  if (expires) {
    res.setHeader('Expires', new Date(Date.now + maxAge * 1000).toUTCString());
  }

  if (cacheControl) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
  }

  if (lastModified) {
    res.setHeader('Last-Modified', stats.mtime.toUTCString());
  }

  if (etag) {
    res.setHeader('E-tag', `${stats.size}-${stats.mtime}`);
  }
}

function isFresh(stats, req, res) {
  //
  refreshRes(stats, res);

  const lastModified = req.headers['if-modified-since'];
  const etag = req.headers['if-none-match'];
  if (!lastModified && !etag) {
    return false;
  }

  if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
    return false;
  }

  if (etag && etag !== res.getHeader('E-tag')) {
    return false;
  }

  return true;
}

module.exports = {
  isFresh
};
