import { toBase64 } from '@/utils';
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

export function saveDataToJson(url: string, { locals }) {
  return writeJsonToSource(toBase64(encodeURI(url)), renderData(url, locals));
}
