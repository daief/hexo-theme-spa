/**
 * client only
 */
import { createBlogApp } from './main';
import { pathToKey } from './utils';

const { app, store, router } = createBlogApp({
  simplePageRoute: window.__SIMPLE_PAGE_ROUTE__,
});

async function bootstrap() {
  try {
    await router.isReady();
    await store.commit('global/setPageData', {
      data: window.__PAGE_DATA__,
      key: pathToKey(router.currentRoute.value.path),
    });
  } catch {}
  app.mount('#app');
}

bootstrap();

// @ts-ignore
window.__app = app;

if (!__PROD__) {
  // @ts-ignore
  window.__baseConfig = __baseConfig;
  // @ts-ignore
  window.__theme = __theme;
}
