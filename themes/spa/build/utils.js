const fs = require('fs-extra');
const path = require('path');

exports.requireOnly = id => {
  const result = require(id);
  delete require.cache[require.resolve(id)];
  return result;
};

/**
 * 构建基础的数据以供注入
 * @param {*} locals
 */
exports.getBaseConfig = locals => {
  const { page, config } = locals;
  return {
    title: page.title ? `${page.title} | ${config.title}` : config.title,
  };
};

exports.writeJsonToSource = (fileName, obj, opts) => {
  fileName = fileName.replace(/(\.json)?$/, '.json');
  const jsonDir = path.resolve(__dirname, '../source/json');
  fs.mkdirpSync(jsonDir);
  fs.writeJsonSync(path.resolve(jsonDir, fileName), obj, {
    replacer: true,
    flag: 'w',
    ...opts,
  });
};
