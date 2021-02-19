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

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: PostPagination,
    children: [],
  },
  { path: '/page/:no', component: PostPagination },
  { path: '/post/:id', component: Post },
  { path: '/categories/', component: CategoryIndex },
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
    component: CategoryPagination,
  },

  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: {
      template: '<div>404</div>',
    },
  },
];

export function createRouterIns() {
  return createRouter({
    history: __SSR__ ? createMemoryHistory() : createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { top: 0 };
      }
    },
  });
}
