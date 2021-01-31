// 只处理页面
hexo.extend.generator.register('svelte', function (locals) {
  const { generator } = this.theme.config;
  const { per_page, order_by } = generator;
  const posts = locals.posts.sort(order_by);
  const { length } = posts;

  const totalPage = per_page ? Math.ceil(length / per_page) : 1;
  const paginationPages = [...Array(totalPage).keys()].map(no => ({
    path: `page/${no + 1}/`,
    data: { __index: true },
    layout: ['index'],
  }));

  paginationPages.unshift({
    path: '',
    data: { __index: true },
    layout: ['index'],
  });

  return [...paginationPages];
});
