'use strict';

const fs = require('fs-extra');
const path = require('path');
const NativeModule = require('module');
const { buildSPA } = require('../build/compile');
const memoize = require('lodash/memoize');

fs.emptyDirSync(path.resolve(__dirname, '../source'));

// 单例缓存
const singleInsBuild = memoize(buildSPA, () => 'SINGLE');
const isDev = hexo.env.env === 'development';

async function spaRenderer(data, locals) {
  const buildHandler = isDev ? buildSPA : singleInsBuild;
  const { clientResult, publicPath } = await buildHandler(data.path, {
    locals,
    hexo: this,
  });

  const { renderHtml, generateJsons } = loadModule('../source/ssr/main');

  generateJsons(this, locals);

  const resultHtml = await renderHtml({
    data,
    hexo: this,
    locals,
    js: clientResult.js.map(it => publicPath + it),
    css: clientResult.css.map(it => publicPath + it),
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

function loadModule(id) {
  const result = require(id);
  if (isDev) {
    delete require.cache[require.resolve(id)];
  }
  return result;
}
