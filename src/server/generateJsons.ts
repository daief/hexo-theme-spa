import { formatHtmlPath, getPageRouteFromHexo, toBase64 } from '@/utils';
import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import { renderData } from './renderData';

function writeJsonToSource(fileName: string, obj: any, opts: any = {}) {
  fileName = fileName.replace(/(\.json)?$/, '.json');
  const jsonDir = path.resolve(__dirname, 'source/json');
  fs.mkdirpSync(jsonDir);
  fs.writeJsonSync(path.resolve(jsonDir, fileName), obj, {
    replacer: true,
    flag: 'w',
    ...opts,
  });
}

export function saveToJsons(hexo, locals) {
  /**
   * @type {string[]}
   */
  const routeList = getPageRouteFromHexo(hexo);

  routeList.forEach(urlPath => {
    urlPath = formatHtmlPath(urlPath);
    writeJsonToSource(
      toBase64(encodeURI(urlPath)),
      renderData(urlPath, hexo, locals),
    );
  });
}

const singleInsSaveJsons = _.memoize(saveToJsons, () => 'SINGLE');

export function generateJsons(hexo, locals) {
  if (__PROD__) {
    return singleInsSaveJsons(hexo, locals);
  }
  return saveToJsons(hexo, locals);
}
