exports.getData = function getData({ locals }) {
  const { page, config } = locals;
  return {
    title: page.title ? `${page.title} | ${config.title}` : config.title,
    a: 111,
    b: locals.url_for('xxx.js'),
  };
};
