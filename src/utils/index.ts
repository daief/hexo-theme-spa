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

export function getPageRouteFromHexo(hexo): string[] {
  return hexo.route
    .list()
    .filter(it => /index\.html$/i.test(it))
    .map(it => formatHtmlPath(it));
}

/**
 * 获取到如 /about、/a-page 等自定义添加的页面，但不包含 /tags、/categories 这些
 * @param hexo
 */
export function getSimplePageFromHexo(hexo): string[] {
  return getPageRouteFromHexo(hexo).filter(it => {
    const [_, firstPathname, ...rest] = it.split('/');
    if (rest.length || it === '/') {
      return false;
    }
    return !['categories', 'tags'].includes(firstPathname);
  });
}
