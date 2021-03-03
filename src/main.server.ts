/**
 * server only
 */

import type Hexo from 'hexo';
import { renderToStringWithMeta } from 'vue-meta';
import { createBlogApp } from './main';
import { renderData } from './server/renderData';
import {
  formatHtmlPath,
  getPageRouteFromHexo,
  getSimplePageFromHexo,
  pathToKey,
} from './utils';
import _ from 'lodash';
import { saveDataToJson } from './server/generateJsons';

export async function renderHtml({
  data,
  locals,
  js,
  css,
  hexo,
}: {
  data: {
    path: string;
  };
  locals;
  hexo: Hexo;
  js: string[];
  css: string[];
}) {
  const simplePageRoute = getSimplePageFromHexo(hexo);
  const url = formatHtmlPath(locals.page.path);

  saveDataToJson(url, { hexo, locals });

  const hexoConfig = locals.config;
  const { app, router, store } = createBlogApp({ simplePageRoute });

  const preRenderData = renderData(url, hexo, locals);

  await store.commit('global/setPageData', {
    data: preRenderData,
    key: pathToKey(url),
  });
  router.replace(url);
  await router.isReady();
  const [html, ctx] = await renderToStringWithMeta(app);

  const getCtxProp = (prop: string) => ctx?.teleports?.[prop] || '';

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="${hexoConfig.language}" class="font-sans text-base">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    ${getCtxProp('head')}
    <script>
      window.__PAGE_DATA__ = ${JSON.stringify(preRenderData)};
      window.__SIMPLE_PAGE_ROUTE__ = ${JSON.stringify(simplePageRoute)};
    </script>

    ${css.map(it => `<link href="${it}" rel="stylesheet">`).join('')}
  </head>
  <body
    itemscope
    itemtype="http://schema.org/WebPage"
    lang="${hexoConfig.language}"
  >
    <div id="app">${html}</div>

    ${js.map(it => `<script src="${it}"></script>`).join('')}
  </body>
</html>`;

  return htmlTemplate;
}
