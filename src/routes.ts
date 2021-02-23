import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from 'vue-router';
import CategoryIndex from './pages/CategoryIndex.vue';
import CategoryPagination from './pages/CategoryPagination.vue';
import Post from './pages/Post.vue';
import PostPagination from './pages/PostPagination.vue';
import { getRouteConfig, merge, PAGE_NAME_MAP } from '@/utils/route';

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
    name: PAGE_NAME_MAP.$404,
    component: {
      template: '<div>404</div>',
    },
  },
]);

export function createRouterIns() {
  return createRouter({
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
      } else {
        return { top: 0 };
      }
    },
  });
}
