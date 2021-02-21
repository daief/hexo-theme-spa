/**
 * ################################################
 * ######## 该目录保持内容纯粹，通用功能
 * ################################################
 */

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
  path = path.replace(/^\/?/, '/');
  return path;
}

function pathToKey(path) {
  return toBase64(formatHtmlPath(path));
}

const INDEX_FLAG = '/';

module.exports.toBase64 = toBase64;
module.exports.trimEndHtml = trimEndHtml;
module.exports.formatHtmlPath = formatHtmlPath;
module.exports.pathToKey = pathToKey;
module.exports.INDEX_FLAG = INDEX_FLAG;
