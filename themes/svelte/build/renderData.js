const { writeJsonToSource } = require('./utils');
const { formatHtmlPath, INDEX_FLAG, toBase64 } = require('../shared');
const UrlPattern = require('url-pattern');

function renderData(renderUrl, hexo) {
  return {
    pathKey: renderUrl,
    page: manager.call(renderUrl, hexo) || {},
  };
}

function saveToJsons(hexo) {
  /**
   * @type {string[]}
   */
  const routeList = hexo.route
    .list()
    // filter only index.html
    .filter(it => /index\.html$/i.test(it));

  routeList.forEach(urlPath => {
    urlPath = formatHtmlPath(urlPath);
    writeJsonToSource(toBase64(urlPath), renderData(urlPath, hexo));
  });
}

const manager = {
  cache: [],
  register(patternString, fn) {
    if (!Array.isArray(patternString)) {
      patternString = [patternString];
    }

    patternString.forEach(str => {
      this.cache.push({
        pattern: new UrlPattern(str),
        fn,
      });
    });
  },
  call(path, hexo) {
    let query = null;
    const target = this.cache.find(it => {
      query = it.pattern.match(path);
      return query;
    });
    if (!target) {
      return {};
    }
    return target.fn.call(null, { query, path }, hexo);
  },
};

manager.register([INDEX_FLAG, '/page/:no'], ({ query }, hexo) => {
  const { generator } = hexo.theme.config;
  const { per_page, order_by } = generator;
  const posts = hexo.locals.get('posts').sort(order_by);
  const length = posts.length;
  let { no } = query;
  no = +no;
  no = no || 1;
  const totalPage = per_page ? Math.ceil(length / per_page) : 1;

  if (!Number.isFinite(no)) {
    return {};
  }

  const formt = i => `/page/${i}/`;
  const prev = no > 1 ? no - 1 : null;
  const next = no < totalPage ? no + 1 : null;

  return {
    posts: posts.slice((no - 1) * per_page, per_page * no).map(post => ({
      id: post.id,
      excerpt: post.excerpt,
      title: post.title,
      comments: post.comments,
      link: post.link,
      path: formatHtmlPath(post.path),
      current_url: post.current_url,
    })),
    total: totalPage,
    current: no,
    prev,
    prev_link: formt(prev || 1),
    next,
    next_link: formt(next || totalPage),
  };
});

exports.renderData = renderData;
exports.saveToJsons = saveToJsons;
