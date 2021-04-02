/**
 * client only
 */
import { createBlogApp } from './main';
import { addRouteGuards } from './routes';
import { pathToKey } from './utils';

async function bootstrap() {
  const { app, store, router } = createBlogApp();

  try {
    app.mount('#app');

    await router.isReady();

    await store.commit('global/setPageData', {
      data: window.__PAGE_DATA__,
      key: pathToKey(router.currentRoute.value.path), // after router ready
    });

    addRouteGuards(router, store);
  } catch (e) {
    console.error('bootstrap fail', e);
  }

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
