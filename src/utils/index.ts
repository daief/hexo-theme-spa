import { NavigationGuardWithThis } from 'vue-router';

/**
 * 从简考虑，凡是跨域链接，均认为站外链接
 * @param link
 * @returns
 */
export function isExternalLink(link: string) {
  if (typeof link !== 'string') return true;
  const siteUrl = new URL(__baseConfig.url);

  // 不是协议开头的拼上 site 的协议
  if (!/^\w+:\/\//i.test(link)) {
    link = link.replace(/^\/?/, siteUrl.origin + '/');
  }

  const url = new URL(link);
  const localUrl = !__SSR__ && !__PROD__ ? new URL(location.href) : siteUrl;
  return url.origin !== localUrl.origin;
}

export function isNil(obj: any) {
  return [null, void 0].includes(obj);
}

export function last<T = any>(arr: T[]): T | null {
  const res = arr[arr.length - 1];
  return isNil(res) ? null : res;
}

export function toBase64(str: string) {
  if (!__SSR__) {
    return btoa(str);
  }
  return Buffer.from(str).toString('base64');
}

export function fromBase64(str: string) {
  if (!__SSR__) {
    return atob(str);
  }
  return Buffer.from(str, 'base64').toString();
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
 * 获取到如 /about、/a-page 等自定义添加的页面，但不包含 /tags、/categories 这些具有特殊意义的路由
 * @param hexo
 */
// export function getSimplePageFromHexo(): string[] {
//   return getPageRouteFromHexo(hexo).filter(it => {
//     if (it === '/') {
//       return false;
//     }
//     return !['/categories/', '/tags/', '/post/', '/404'].some(prefix =>
//       it.startsWith(prefix),
//     );
//   });
// }

export function removePathTailPage(path: string) {
  return path.replace(/(\/page\/\d+\/?)?$/i, '');
}

export const clientPathChangeGuard = (
  g: NavigationGuardWithThis<void>,
): NavigationGuardWithThis<void> => {
  return (to, from, ...args) => {
    if (__SSR__ || to.path === from.path) return;
    return g(to, from, ...args);
  };
};
