exports.getData = function getData({ locals }) {
  const { page, config, theme } = locals;
  return {
    posts: page.posts.map(post => {
      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
      };
    }),
  };
};
