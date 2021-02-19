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

  return [
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
    ...locals.categories.reduce((result, category) => {
      if (!category.length) return result;
      return [
        ...result,
        ...paginationUtil(category.posts, {
          perPage,
          pathPattern: category.path.replace(/\/?$/, '') + '/page/%d/',
        }),
      ];
    }, []),
    // TODO 404 page
    {
      path: '404',
    },
    {
      path: '404-dev',
    },
  ].map(it => ({
    layout: ['index'],
    ...it,
  }));
});

function paginationUtil(dataArray = [], { perPage, pathPattern, data }) {
  const { length } = dataArray;
  const totalPage = perPage ? Math.ceil(length / perPage) : 1;
  return [...Array(totalPage).keys()].map(no => ({
    path: pathPattern.replace(/\%d/g, no + 1),
    data: { ...data },
  }));
}
