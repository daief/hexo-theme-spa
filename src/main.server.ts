/**
 * server only
 */

import type Hexo from 'hexo';
import { renderToStringWithMeta } from 'vue-meta';
import { createBlogApp } from './main';
import { renderData } from './server/renderData';
import { formatHtmlPath } from './utils';
import _ from 'lodash';
import { generateJsons } from './server/generateJsons';

export { generateJsons };

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
  const url = formatHtmlPath(locals.page.path);
  const hexoConfig = locals.config;
  const { app, router, store } = createBlogApp();

  const preRenderData = renderData(url, hexo, locals);

  await store.commit('global/setPageData', preRenderData);
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