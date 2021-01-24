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
