'use strict';

const fs = require('fs-extra');
const path = require('path');
const NativeModule = require('module');
const { buildSvelte } = require('../build/compile');
const memoize = require('lodash/memoize');
const nunjucks = require('nunjucks');

const tplPath = path.resolve(__dirname, '../build/tpl.html');
const env = nunjucks.configure(tplPath, { autoescape: false });

function evalModuleCode(loaderContext, code, filename) {
  const module = new NativeModule(filename, loaderContext);
  module.paths = NativeModule._nodeModulePaths(loaderContext.context);
  module.filename = filename;
  module._compile(code, filename);
  return module.exports;
}

fs.emptyDirSync(path.resolve(__dirname, '../source'));

const singleInsBuild = memoize(buildSvelte, () => 'SINGLE');

async function svelteRenderer(data, locals) {
  const filename = data.path;
  const { ssrResult, clientResult } = await singleInsBuild(filename, {
    locals,
    hexo: this,
  });
  const { outputPath } = ssrResult;
  const ssrBundleAsset = ssrResult.assets.find(it => /.js$/i.test(it.name));
  const ssrfile = path.resolve(outputPath, ssrBundleAsset.name);
  const renderUrl = '/' + locals.page.path.replace('/index.html', '');

  // pre render
  const { html } = require(ssrfile).default.render({
    url: renderUrl,
  });

  const resultHtml = env.render(tplPath, {
    appHtml: html,
    bundleScripts: `<script src="/${clientResult.assets[0].name}"></script>`,
  });

  return resultHtml;
}

hexo.extend.renderer.register('svelte', 'html', svelteRenderer);

if (hexo.env.cmd === 'server') {
  hexo.extend.filter.register('after_render:html', async function (str, data) {
    await hexo.load();
    return str;
  });
}

if (hexo.env.cmd === 'generate') {
  hexo.extend.filter.register('before_exit', function () {
    fs.copySync(path.resolve(hexo.theme_dir, 'source'), hexo.public_dir, {
      filter: src =>
        ![/\/source\/tpl\//i, /\/source\/ssr\//i].some(it => it.test(src)),
      overwrite: true,
    });
  });
}
