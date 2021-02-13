function toBase64(str) {
  if (typeof window !== 'undefined') {
    return btoa(str);
  }
  return Buffer.from(str).toString('base64');
}

/**
 * ```js
 * trimEndHtml('/'); // /
 * trimEndHtml('/a'); // /a
 * trimEndHtml('/a/'); // /a
 * trimEndHtml('/a/index.html'); // /a
 * ```
 */
function trimEndHtml(path) {
  path = path.replace(/(\/|\/?index\.html)?$/, '');
  return path || '/';
}

function formatHtmlPath(path) {
  path = trimEndHtml(path);
  path = !path || path === '/' ? INDEX_FLAG : path;
  return path.replace(/^\/?/, '/');
}

const INDEX_FLAG = '/';

exports.toBase64 = toBase64;
exports.trimEndHtml = trimEndHtml;
exports.formatHtmlPath = formatHtmlPath;
exports.INDEX_FLAG = INDEX_FLAG;
