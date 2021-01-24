'use strict';

const fs = require('fs-extra');
const path = require('path');
const NativeModule = require('module');
const { buildSvelte } = require('../build/compile');

function evalModuleCode(loaderContext, code, filename) {
  const module = new NativeModule(filename, loaderContext);
  module.paths = NativeModule._nodeModulePaths(loaderContext.context);
  module.filename = filename;
  module._compile(code, filename);
  return module.exports;
}

fs.emptyDirSync(path.resolve(__dirname, '../source'));

async function svelteRenderer(data, locals) {
  const filename = data.path;
  const result = await buildSvelte.call(this, filename, { ssr: true, locals });
  return result;
}

hexo.extend.renderer.register('svelte', 'html', svelteRenderer);

if (hexo.env.cmd === 'server') {
  hexo.extend.filter.register('after_render:html', async function (str, data) {
    await hexo.load();
    return str;
  });
}
