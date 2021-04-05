/**
 * server only
 */

import { renderToStringWithMeta } from 'vue-meta';
import { createBlogApp } from './main';
import { renderData } from './server/renderData';
import { formatHtmlPath, pathToKey } from './utils';
import _ from 'lodash';
import { saveDataToJson } from './server/generateJsons';

export { renderData };

export async function renderHtml({
  data,
  locals,
  js,
  css,
}: {
  data: {
    path: string;
  };
  locals;
  js: string[];
  css: string[];
}) {
  // const simplePageRoute = getSimplePageFromHexo();
  const url = formatHtmlPath(locals.page.path);

  if (__PROD__) {
    saveDataToJson(url, { locals });
  }

  const hexoConfig = locals.config;
  const { app, router, store } = createBlogApp();

  const preRenderData = renderData(url, locals);

  console.log(1111122222);

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
      window.__PAGE_DATA__ = JSON.parse(unescape(${
        // 有些东西直接用正则匹配标签进行处理，故编码一下避免意外地被处理
        JSON.stringify(escape(JSON.stringify(preRenderData)))
      }));
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
