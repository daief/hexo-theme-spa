const { writeJsonToSource } = require('./utils');
const { formatHtmlPath, INDEX_FLAG, toBase64 } = require('../shared');
const { createRouterMatcher } = require('vue-router');
const _ = require('lodash');

const pathMatcher = createRouterMatcher(
  [
    {
      path: INDEX_FLAG,
      meta: {
        getData: getPostPaginationData,
      },
    },
    {
      path: '/page/:no',
      meta: {
        getData: getPostPaginationData,
      },
    },
    {
      path: '/categories/:categories+',
      redirect: to => ({
        name: 'CategoriesPagination',
        params: {
          categories: to.params.categories,
          no: 1,
        },
      }),
    },
    {
      name: 'CategoriesPagination',
      path: '/categories/:categories+/page/:no',
      meta: {
        getData: getCategoriesPaginationData,
      },
    },
  ],
  // avoid error
  {},
);

// hexo.locals 只读取数据
// locals 合并了各种 helper 的方法
function renderData(renderUrl, hexo, locals) {
  let res = {};
  try {
    const { matched, params } = pathMatcher.resolve({
      path: renderUrl,
    });
    const { meta } = matched[0];
    res = meta.getData({ params: { ...params } }, hexo, locals);
  } catch (error) {
    // console.log('renderData error', `[${renderUrl}]`, error);
  }
  return {
    pathKey: renderUrl,
    page: res,
  };
}

function saveToJsons(hexo, locals) {
  /**
   * @type {string[]}
   */
  const routeList = hexo.route
    .list()
    // filter only index.html, page route
    .filter(it => /index\.html$/i.test(it));

  routeList.forEach(urlPath => {
    urlPath = encodeURI(urlPath);
    urlPath = formatHtmlPath(urlPath);
    writeJsonToSource(toBase64(urlPath), renderData(urlPath, hexo, locals));
  });
}

function getPostPaginationData({ params }, hexo, locals) {
  const { generator } = hexo.theme.config;
  const { per_page, order_by } = generator;
  const posts = hexo.locals.get('posts').sort(order_by);
  const length = posts.length;
  let { no } = params;
  no = +no;
  no = no || 1;
  const totalPage = per_page ? Math.ceil(length / per_page) : 1;

  if (!Number.isFinite(no)) {
    return {};
  }

  const formt = i => `/page/${i}/`;
  const prev = no > 1 ? no - 1 : null;
  const next = no < totalPage ? no + 1 : null;

  /* [
    'title',     'date',      'id',
    '_content',  'source',    'raw',
    'slug',      'published', 'updated',
    'comments',  'layout',    'photos',
    'link',      '_id',       'content',
    'site',      'excerpt',   'more',
    'path',      'permalink', 'full_source',
    'asset_dir', 'tags',      'categories',
    'prev',      'next',      '__post'
  ] */

  return {
    posts: posts
      .slice((no - 1) * per_page, per_page * no)
      .map(post => stringifyPost(locals, post)),
    total: totalPage,
    current: no,
    prev,
    prev_link: formt(prev || 1),
    next,
    next_link: formt(next || totalPage),
  };
}

function getCategoriesPaginationData({ params }, hexo, locals) {
  const { generator } = hexo.theme.config;
  const { per_page, order_by } = generator;

  let { categories, no } = params;

  const category = hexo.locals
    .get('categories')
    .find({ name: _.last(categories) })
    .toArray()
    .find(
      it =>
        (it.posts.first().categories || []).map(cy => cy.name).join(',') ===
        categories.join(','),
    );

  const posts = category ? category.posts.sort(order_by) : [];

  return {
    posts: posts
      .slice((no - 1) * per_page, per_page * no)
      .map(post => stringifyPost(locals, post, { prev: true })),
  };
}

function stringifyPost(locals, post, extra) {
  extra = {
    prev: false,
    next: false,
    content: false,
    ...extra,
  };
  const extraData = _.omit(extra, ['prev', 'next', 'content']);
  if (!post) {
    return null;
  }
  return {
    id: post.id,
    excerpt: post.excerpt,
    title: post.title,
    comments: post.comments,
    link: post.link,
    path: formatHtmlPath(post.path),
    published: post.published,
    comments: post.comments,
    photos: post.photos,
    date: post.date,
    updated: post.updated,
    tags: (post.tags || []).map(tag => ({
      name: tag.name,
      id: tag._id,
      slug: tag.slug,
      path: tag.path,
      // permalink: tag.permalink,
    })),
    categories: (post.categories || []).map(category => ({
      name: category.name,
      id: category._id,
      slug: category.slug,
      path: category.path,
      parent: category.parent,
    })),
    min2read: locals.min2read(post.content),
    wordCount: locals.wordcount(post.content),
    prev: extra.prev
      ? stringifyPost(locals, post.prev, { ...extra, prev: false })
      : null,
    content: extra.content ? post.content : null,
    ...extraData,
  };
}

exports.renderData = renderData;
exports.saveToJsons = saveToJsons;
