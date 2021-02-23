/**
 * client only
 */
import { createBlogApp } from './main';
import { pathToKey } from './utils';

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

if (!__PROD__) {
  // @ts-ignore
  window.__baseConfig = __baseConfig;
  // @ts-ignore
  window.__theme = __theme;
}
