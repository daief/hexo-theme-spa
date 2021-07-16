const fs = require('fs-extra');
const path = require('path');

exports.requireOnly = id => {
  const result = require(id);
  delete require.cache[require.resolve(id)];
  return result;
};
