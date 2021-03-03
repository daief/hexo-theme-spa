/**
 * client only
 */
import { createBlogApp } from './main';
import { pathToKey } from './utils';

async function bootstrap() {
  const { app, store, router } = createBlogApp({
    simplePageRoute: window.__SIMPLE_PAGE_ROUTE__,
  });

  try {
    await router.isReady();

    if (!__SSR__ && !__PROD__) {
      // !! 开发环境禁止前端路由
      router.beforeEach(to => {
        location.href = to.fullPath;
        return false;
      });
    }

    await store.commit('global/setPageData', {
      data: window.__PAGE_DATA__,
      key: pathToKey(router.currentRoute.value.path),
    });
  } catch {}

  app.mount('#app');

  (window as any).__app = app;
}

if (!__PROD__) {
  // @ts-ignore
  window.__baseConfig = __baseConfig;
  // @ts-ignore
  window.__theme = __theme;
}

if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
  // redirect IE to Edge
  // This browser is no longer supported
  window.location.href = 'microsoft-edge:' + window.location.href;
} else {
  bootstrap();
}
