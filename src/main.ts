import { createSSRApp, createApp } from 'vue';
import { createRouterIns } from './routes';
import { createStoreIns } from './store';
import './styles';
import { createMetaIns } from './meta';

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-ch');

export const App = require(__PAGE_PATH__).default;

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
