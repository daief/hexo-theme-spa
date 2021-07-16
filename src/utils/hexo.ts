export function url_for(path: string) {
  if (__SSR__) {
    const utils = require('hexo-util');
    return utils.us;
  }
}
