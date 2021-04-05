import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  Router,
  RouteRecordRaw,
} from 'vue-router';
import CategoryIndex from './pages/CategoryIndex.vue';
import CategoryPagination from './pages/CategoryPagination.vue';
import Post from './pages/Post.vue';
import PostPagination from './pages/PostPagination.vue';
import SimplePage from './pages/SimplePage.vue';
import TagsIndex from './pages/TagsIndex.vue';
import TagsPagination from './pages/TagsPagination.vue';
import ArchivePagination from './pages/ArchivePagination.vue';
import { getRouteConfig, merge, PAGE_NAME_MAP } from '@/utils/route';
import { useAxios } from './hooks/useAxios';
import { Store } from 'vuex';
import NProgress from 'nprogress';
import { watch } from 'vue';
import { clientPathChangeGuard, pathToKey } from './utils';

export function createRouterIns() {
  const routes: RouteRecordRaw[] = merge(getRouteConfig(), [
    {
      name: PAGE_NAME_MAP.index,
      component: PostPagination,
    },
    { name: PAGE_NAME_MAP.indexPagination, component: PostPagination },
    { name: PAGE_NAME_MAP.postDetail, component: Post },
    { name: PAGE_NAME_MAP.categoryIndex, component: CategoryIndex },
    {
      name: PAGE_NAME_MAP.categoryPagination,
      component: CategoryPagination,
    },
    {
      name: PAGE_NAME_MAP.simplePages,
      component: SimplePage,
    },
    {
      name: PAGE_NAME_MAP.tagsIndex,
      component: TagsIndex,
    },
    {
      name: PAGE_NAME_MAP.tagsPagination,
      component: TagsPagination,
    },
    {
      name: PAGE_NAME_MAP.$404,
      component: Post,
    },
    {
      name: PAGE_NAME_MAP.archives,
      component: ArchivePagination,
    },
  ]);

  const router = createRouter({
    history: __SSR__ ? createMemoryHistory() : createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (to.hash) {
        return {
          el: to.hash,
        };
      }

      if (savedPosition) {
        return savedPosition;
      }

      return { top: 0 };
    },
  });

  return router;
}

export function addRouteGuards(router: Router, store: Store<any>) {
  // ------------------------------------------------------------------------ load page data
  const [resp, fetchPageData, { cancel }] = useAxios('');

  watch(
    () => resp.value.loading,
    loading => {
      // sync loading state
      store.commit('global/setLoading', loading);
    },
  );

  router.beforeEach(
    clientPathChangeGuard(async (to, from) => {
      cancel();
      NProgress.start();
      try {
        const key = pathToKey(to.path);
        const resp = await fetchPageData({
          url: '/json/' + key + '.json',
        });

        await store.commit('global/setPageData', {
          key,
          data: resp.data,
        });
        NProgress.done();
      } catch (error) {
        NProgress.done();

        if (error.isAxiosError && error.response.status === 404) {
          return {
            name: PAGE_NAME_MAP.$404,
            query: {
              ref: from.path,
            },
          };
        }
      }
    }),
  );
} // addRouteGuards
