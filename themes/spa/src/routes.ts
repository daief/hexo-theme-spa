import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from 'vue-router';

import Post from './pages/Post.vue';
import Pagination from './pages/Pagination.vue';

// 1. Define route components.

// These can be imported from other files
const Home = { template: '<div>Home</div>' };

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: Pagination },
  { path: '/post/:id', component: Post },
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.

export function createRouterIns() {
  return createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: __SSR__ ? createMemoryHistory() : createWebHistory(),
    routes, // short for `routes: routes`
  });
}
