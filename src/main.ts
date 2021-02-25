import { createSSRApp, createApp } from 'vue';
import { createRouterIns } from './routes';
import { createStoreIns } from './store';
import './styles';
import { createMetaIns } from './meta';

export const App = require(__PAGE_PATH__).default;

export function createBlogApp({
  simplePageRoute,
}: {
  simplePageRoute: string[];
}) {
  const app = __SSR__ ? createSSRApp(App) : createApp(App);

  const router = createRouterIns({ simplePageRoute });
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
