exports.getData = function getData({ locals }) {
  const { page, config, theme } = locals;
  console.log({ ...page.posts.toArray()[0], prev: null, next: null });
  return {
    theme,
    title: page.title ? `${page.title} | ${config.title}` : config.title,
    scoped: {
      posts: page.posts.map(post => {
        return {
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
        };
      }),
    },
  };
};
