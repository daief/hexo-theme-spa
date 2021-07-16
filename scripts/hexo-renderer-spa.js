'use strict';

const fs = require('fs-extra');
const path = require('path');
const NativeModule = require('module');

fs.emptyDirSync(path.resolve(__dirname, '../source'));

const isDev = hexo.env.env === 'development';

let savedLocals;

global.hexo = global.hexo || hexo;

/**
 * @this {import('hexo')}
 * @param {*} data
 * @param {*} locals
 */
async function spaRenderer(data, locals) {
  savedLocals = locals;

  const { devBuildSPA, buildSPA } = require('../build/compile');
  const { clientResult, publicPath } = await (isDev ? devBuildSPA : buildSPA)(
    data.path,
    {
      locals,
    },
  );

  const { renderHtml } = loadModule('../source/ssr/main');

  const resultHtml = await renderHtml({
    data,
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

hexo.extend.filter.register('server_middleware', function (app) {
  app.use(function (req, res, next) {
    if (/^\/json\/.*\.json$/i.test(req.url)) {
      const key = req.url.replace(/^\/json\//i, '').replace(/\.json$/i, '');
      const { renderData } = loadModule('../source/ssr/main');
      const path = Buffer.from(key, 'base64').toString();
      const data = renderData(path, savedLocals);
      res.writeHead(200, {
        'Content-type': 'application/json',
      });
      res.write(JSON.stringify(data));
      res.end();
      return;
    }
    next();
  });
});

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
