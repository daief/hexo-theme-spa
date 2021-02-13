import { createSSRApp, createApp } from 'vue';
import { createRouterIns } from './routes';
import { createStoreIns } from './store';
const App = require(__PAGE_PATH__).default;

export function createBlogApp() {
  const app = __SSR__ ? createSSRApp(App) : createApp(App);

  const router = createRouterIns();
  const store = createStoreIns();

  app.use(store);
  app.use(router);

  return {
    app,
    router,
    store,
  };
}

if (!__SSR__) {
  const { app, store } = createBlogApp();
  store.commit('global/setPageData', __PAGE_DATA__);

  app.mount('#app');

  // @ts-ignore
  window.__app = app;
}

export async function createSSRBlogApp(url: string, preRenderData: any) {
  if (!__SSR__) return;
  const { app, router, store } = createBlogApp();

  store.commit('global/setPageData', preRenderData);

  router.replace(url);
  await router.isReady();
  return { app, router };
}

export default () => null;
