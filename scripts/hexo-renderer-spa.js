'use strict';

const fs = require('fs-extra');
const path = require('path');
const NativeModule = require('module');
const { buildSPA } = require('../build/compile');
const memoize = require('lodash/memoize');
const nunjucks = require('nunjucks');
const { renderToString } = require('@vue/server-renderer');

const { requireOnly } = require('../build/utils');
const { renderData, saveToJsons } = require('../build/renderData');
const { formatHtmlPath } = require('../shared');

const TEMPLATE_PATH = path.resolve(__dirname, '../build/app/tpl.html');
const env = nunjucks.configure(TEMPLATE_PATH, { autoescape: false });

fs.emptyDirSync(path.resolve(__dirname, '../source'));

// 单例缓存
const singleInsBuild = memoize(buildSPA, () => 'SINGLE');
const singleInsSaveToJsons = memoize(saveToJsons, () => 'SINGLE');
const isDev = hexo.env.env === 'development';

async function spaRenderer(data, locals) {
  const saveHandler = isDev ? saveToJsons : singleInsSaveToJsons;
  saveHandler(this);

  const filename = data.path;
  const buildHandler = isDev ? buildSPA : singleInsBuild;
  const { ssrResult, clientResult } = await buildHandler(filename, {
    locals,
    hexo: this,
  });
  const { outputPath } = ssrResult;
  const clientManifestJson = requireOnly(
    path.resolve(outputPath, 'manifest.client.json'),
  );
  const ssrBundleAsset = ssrResult.assets.find(it => /.js$/i.test(it.name));
  const ssrfile = path.resolve(outputPath, ssrBundleAsset.name);
  const renderUrl = formatHtmlPath(locals.page.path);

  const prerenderData = requireOnly('../build/renderData').renderData(
    renderUrl,
    this,
  );

  const { createSSRBlogApp } = require(ssrfile);

  const { app } = await createSSRBlogApp(renderUrl, prerenderData);
  const html = await renderToString(app);
  const resultHtml = env.render(TEMPLATE_PATH, {
    appHtml: html,
    bundleScripts: `<script src="${clientManifestJson['main.js']}"></script>`,
    headPartial: `<link href="${clientManifestJson['main.css']}" rel="stylesheet">`,
    serverData: JSON.stringify(prerenderData),
    config: locals.config,
  });

  if (isDev) {
    try {
      // source 下的目录在启动后生成，手动 load 一下
      await hexo.load();
    } catch (error) {
      console.log('Load error', error);
    }
  }

  return resultHtml;
}

hexo.extend.renderer.register('vue', 'html', spaRenderer);

if (hexo.env.env === 'production') {
  hexo.extend.filter.register('before_exit', function () {
    fs.copySync(path.resolve(hexo.theme_dir, 'source'), hexo.public_dir, {
      filter: src =>
        ![/\/source\/tpl\//i, /\/source\/ssr\//i].some(it => it.test(src)),
      overwrite: true,
    });
  });
}

function evalModuleCode(loaderContext, code, filename) {
  const module = new NativeModule(filename, loaderContext);
  module.paths = NativeModule._nodeModulePaths(loaderContext.context);
  module.filename = filename;
  module._compile(code, filename);
  return module.exports;
}
