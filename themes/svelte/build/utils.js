exports.requireOnly = id => {
  const result = require(id);
  delete require.cache[require.resolve(id)];
  return result;
};

/**
 * 构建公共的数据以供注入
 * @param {*} locals
 */
exports.getCommonData = locals => {
  const { page, config } = locals;
  return {
    title: page.title ? `${page.title} | ${config.title}` : config.title,
  };
};
