import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from 'vue-router';

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
  });
}
