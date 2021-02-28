import { formatHtmlPath, getSimplePageFromHexo } from '@/utils';
import { getRouteConfig, merge, PAGE_NAME_MAP } from '@/utils/route';
import { createRouterMatcher, RouterMatcher } from 'vue-router';
import _ from 'lodash';
import { ICategory, IPost } from '@/@types/entities';

// hexo.locals 只读取数据
// locals 合并了各种 helper 的方法
export function renderData(renderUrl: string, hexo, locals) {
  let res = {};
  try {
    const { matched, params } = getPathMatcher({ hexo })
      // @ts-ignore
      .resolve({
        path: renderUrl,
      });
    const firstMatched = matched[0];

    const { meta } = firstMatched;
    res = meta.getData
      ? meta.getData({ ...firstMatched, params: { ...params } }, hexo, locals)
      : {};
  } catch (error) {
    console.log('renderData error', `[${renderUrl}]`, error);
    res = {};
  }
  return {
    pathKey: renderUrl,
    page: res,
  };
}

let pathMatcher;

function getPathMatcher({ hexo }): RouterMatcher {
  pathMatcher =
    pathMatcher ||
    createRouterMatcher(
      merge(getRouteConfig(getSimplePageFromHexo(hexo)), [
        {
          name: PAGE_NAME_MAP.index,
          meta: {
            getData: getPostPaginationData,
          },
        },
        {
          name: PAGE_NAME_MAP.indexPagination,
          meta: {
            getData: getPostPaginationData,
          },
        },
        {
          name: PAGE_NAME_MAP.postDetail,
          meta: {
            getData: getPostDetail,
          },
        },
        {
          name: PAGE_NAME_MAP.categoryIndex,
          meta: {
            getData: getCategoriesIndexData,
          },
        },
        {
          name: PAGE_NAME_MAP.categoryPagination,
          path: '/categories/:categories+/page/:no',
          meta: {
            getData: getCategoriesPaginationData,
          },
        },
        {
          name: PAGE_NAME_MAP.simplePages,
          meta: {
            getData: ({ params }, hexo: any, locals: any) => {
              // const { pageName } = params;
              return {
                page: stringifyPost(locals, locals.page, { more: true }),
              };
            },
          },
        },
      ]),
      // avoid error
      {},
    );
  return pathMatcher;
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

  const { categories, no } = params;

  // TODO 考虑重名的子分类？
  const category = hexo.locals
    .get('categories')
    .find({ name: _.last(categories) })
    .first();

  const posts = category ? category.posts.sort(order_by) : [];

  const pagination = dataPaginationHelper({
    current: no,
    pageSize: per_page,
    data: posts,
  });

  return {
    category: stringifyCategory(category),
    posts: pagination.data.map(post =>
      stringifyPost(locals, post, { prev: true }),
    ),
    current: pagination.current,
    prev: pagination.prev,
    next: pagination.next,
    total: pagination.total,
    count: pagination.count,
  };
}

function getCategoriesIndexData({ params }, hexo, locals) {
  return {
    htmlContent: locals.list_categories(),
    total: hexo.locals.get('categories').length,
  };
}

function getPostDetail({ params }, hexo, locals) {
  const { generator } = hexo.theme.config;
  const { order_by } = generator;
  const { id } = params;
  const post = hexo.locals.get('posts').sort(order_by).find({ id }).first();
  return {
    post: stringifyPost(locals, post, {
      more: true,
      prev: true,
      next: true,
    }),
  };
}

function stringifyPost(locals, post, extra: any = {}): IPost {
  extra = {
    prev: false,
    next: false,
    more: false,
    ...extra,
  };
  const extraData = _.omit(extra, ['prev', 'next', 'more']);
  if (!post) {
    return null;
  }
  // const $excerpt = cheerio.load(post.excerpt || '');
  // const $more = cheerio.load(post.more || '');
  return {
    id: post.id,
    title: post.title,
    comments: post.comments,
    link: post.link,
    path: formatHtmlPath(post.path),
    published: post.published,
    photos: post.photos,
    date: post.date,
    updated: post.updated,
    tags: (post.tags || []).map(tag => stringifyTag(tag)),
    categories: (post.categories || []).map(category =>
      stringifyCategory(category),
    ),
    min2read: locals.min2read(post.content),
    wordCount: locals.wordcount(post.content),
    prev: extra.prev
      ? stringifyPost(locals, post.prev, { ...extra, prev: false, next: false })
      : null,
    next: extra.next
      ? stringifyPost(locals, post.next, { ...extra, prev: false, next: false })
      : null,
    excerpt: post.excerpt,
    more: extra.more ? post.more : null,
    ...extraData,
  };
}

function stringifyTag(tag) {
  return {
    name: tag.name,
    id: tag._id,
    slug: tag.slug,
    path: formatHtmlPath(tag.path),
    // permalink: tag.permalink,
  };
}

function stringifyCategory(category): ICategory {
  if (!category) return null;

  return {
    name: category.name,
    id: category._id,
    slug: category.slug,
    path: formatHtmlPath(category.path),
    parent: category.parent,
  };
}

function dataPaginationHelper({
  current,
  pageSize = 10,
  data,
}: {
  current: number;
  pageSize?: number;
  data: any[];
}) {
  current = +current;
  current = current || 1;
  const { length } = data;
  const totalPage = pageSize ? Math.ceil(length / pageSize) : 1;

  const prev = current > 1 ? current - 1 : null;
  const next = current < totalPage ? current + 1 : null;

  return {
    data: data.slice((current - 1) * pageSize, pageSize * current),
    total: totalPage,
    count: length,
    current,
    prev,
    next,
  };
}
