export function isExternalLink(link: string) {
  const url = new URL(link);
  const siteUrl = new URL(__baseConfig.url);
  const localUrl = __SSR__ ? siteUrl : new URL(location.href);
  return url.hostname !== localUrl.hostname;
}

export function isNil(obj: any) {
  return [null, void 0].includes(obj);
}

export function toBase64(str: string) {
  if (!__SSR__) {
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
export function trimEndHtml(path: string) {
  path = path.replace(/(\/|\/?index\.html)?$/, '');
  return path || '/';
}

export function formatHtmlPath(path: string) {
  path = trimEndHtml(path);
  path = !path || path === '/' ? INDEX_FLAG : path;
  path = path.replace(/^\/?/, '/');
  return path;
}

export function pathToKey(path: string) {
  return toBase64(formatHtmlPath(path));
}

const INDEX_FLAG = '/';
