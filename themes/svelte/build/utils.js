exports.requireOnly = (id) => {
  const result = require(id);
  delete require.cache[require.resolve(id)];
  return result;
};
