exports.getData = function getData({ locals }) {
  return {
    a: 111,
    b: locals.url_for('xxx.js'),
  };
};
