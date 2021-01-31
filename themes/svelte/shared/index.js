function toBase64(str) {
  if (typeof window !== 'undefined') {
    return btoa(str);
  }
  return Buffer.from(str).toString('base64');
}

function trimEndHtml(path) {
  return path.replace(/(\/?index\.html)?$/, '');
}

function formatHtmlPath(path) {
  path = trimEndHtml(path);
  path = !path || path === '/' ? INDEX_FLAG : path;
  return path.replace(/^\/?/, '/');
}

const INDEX_FLAG = '/index-flag';

exports.toBase64 = toBase64;
exports.trimEndHtml = trimEndHtml;
exports.formatHtmlPath = formatHtmlPath;
exports.INDEX_FLAG = INDEX_FLAG;
