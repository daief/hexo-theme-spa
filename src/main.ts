import { createSSRApp, createApp } from 'vue';
import { pathToKey } from '@shared';
import { createRouterIns } from './routes';
import { createStoreIns } from './store';
import './styles';
import { createMetaIns } from './meta';

const App = require(__PAGE_PATH__).default;

export function createBlogApp() {
  const app = __SSR__ ? createSSRApp(App) : createApp(App);

  const router = createRouterIns();
  const store = createStoreIns();
  const metaManager = createMetaIns();

  app.use(store);
  app.use(router);
  app.use(metaManager);

  return {
    app,
    router,
    store,
    metaManager,
  };
}

if (!__SSR__) {
  const { app, store, router } = createBlogApp();

  router.isReady().then(() => {
    store.commit('global/setPageData', {
      data: __PAGE_DATA__,
      key: pathToKey(router.currentRoute.value.path),
    });
  });

  app.mount('#app');

  // @ts-ignore
  window.__app = app;
}

export async function createSSRBlogApp(url: string, preRenderData: any) {
  if (!__SSR__) return;
  const { app, router, store } = createBlogApp();
  await store.commit('global/setPageData', preRenderData);
  router.replace(url);
  await router.isReady();
  return { app, router };
}

if (!__PROD__ && !__SSR__) {
  // @ts-ignore
  window.__baseConfig = __baseConfig;
  // @ts-ignore
  window.__theme = __theme;
}
