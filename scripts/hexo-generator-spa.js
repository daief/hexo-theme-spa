/**
 * 只处理页面
 * hexo 内部只会生成这些页面
 * - about/、categories/ 等一级页面
 * - post/:id 详情页
 * - index 主页
 */
hexo.extend.generator.register('spa', function (locals) {
  const { generator } = this.theme.config;
  const { per_page: perPage } = generator;

  const result = [
    // 文章分页
    {
      path: '',
      data: { __index: true },
    },
    ...paginationUtil(locals.posts, {
      perPage,
      pathPattern: 'page/%d/',
      data: { __index: true },
    }),
    { path: 'categories/' },
    // category 分页
    ...locals.categories.reduce((rs, category) => {
      if (!category.length) return rs;
      return [
        ...rs,
        { path: category.path },
        ...paginationUtil(category.posts, {
          perPage,
          pathPattern: category.path.replace(/\/?$/, '') + '/page/%d/',
        }),
      ];
    }, []),
    // tag 分页
    ...locals.tags.reduce((rs, tag) => {
      if (!tag.length) return rs;
      return [
        ...rs,
        { path: tag.path },
        ...paginationUtil(tag.posts, {
          perPage,
          pathPattern: tag.path.replace(/\/?$/, '') + '/page/%d/',
        }),
      ];
    }, []),
    // 归档 archives
    { path: 'archives/' },
    ...paginationUtil(locals.posts, {
      perPage,
      pathPattern: 'archives/page/%d/',
    }),
    // 404
    {
      path: '404.html',
    },
  ].map(it => ({
    layout: ['index'],
    ...it,
  }));

  return result;
});

function paginationUtil(dataArray = [], { perPage, pathPattern, data }) {
  const { length } = dataArray;
  const totalPage = perPage ? Math.ceil(length / perPage) : 1;
  return [...Array(totalPage).keys()].map(no => ({
    path: pathPattern.replace(/\%d/g, no + 1),
    data: { ...data },
  }));
}
