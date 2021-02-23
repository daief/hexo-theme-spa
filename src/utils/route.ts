import { RouteRecordRaw } from 'vue-router';

export enum PAGE_NAME_MAP {
  index = 'index',
  indexPagination = 'indexPagination',
  postDetail = 'postDetail',
  categoryIndex = 'categoryIndex',
  categoryPagination = 'categoryPagination',
  categoryPaginationWithoutPage = 'categoryPaginationWithoutPage',
  $404 = '404',
}

export function getRouteConfig(): Partial<RouteRecordRaw>[] {
  return [
    {
      name: PAGE_NAME_MAP.index,
      path: '/',
    },
    { name: PAGE_NAME_MAP.indexPagination, path: '/page/:no' },
    { name: PAGE_NAME_MAP.postDetail, path: '/post/:id' },
    { name: PAGE_NAME_MAP.categoryIndex, path: '/categories/' },
    {
      name: PAGE_NAME_MAP.categoryPaginationWithoutPage,
      path: '/categories/:categories+',
      redirect: to => ({
        name: PAGE_NAME_MAP.categoryPagination,
        params: {
          categories: to.params.categories,
          no: 1,
        },
      }),
    },
    {
      name: PAGE_NAME_MAP.categoryPagination,
      path: '/categories/:categories+/page/:no',
    },
    {
      name: PAGE_NAME_MAP.$404,
      path: '/:pathMatch(.*)*',
    },
  ];
}

export function merge(arr1 = [], arr2 = []) {
  const length = Math.max(arr1.length, arr2.length);
  const map = new Map(Object.entries(arr2));

  return [...Array(length).keys()]
    .map(i => {
      const it1 = arr1[i];
      if (it1) {
        const it2Index = arr2.findIndex(_ => _.name === it1.name);
        const it2 = arr2[it2Index];
        map.delete(it2Index + '');
        return {
          ...it1,
          ...it2,
        };
      }

      // arr2 longer
      const key = map.keys()[0];
      const rs = map.get(key);

      if (rs) {
        map.delete(key);
        return {
          ...rs,
        };
      }

      return null;
    })
    .filter(Boolean);
}
