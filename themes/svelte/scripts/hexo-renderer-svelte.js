'use strict';

const vm = require('vm');
const util = require('util');
const fs = require('fs');
const path = require('path');
const NativeModule = require('module');
const ts = require('typescript');
const webpack = require('webpack');
const { requireOnly } = require('../build/utils');

function evalModuleCode(loaderContext, code, filename) {
  const module = new NativeModule(filename, loaderContext);
  module.paths = NativeModule._nodeModulePaths(loaderContext.context);
  module.filename = filename;
  module._compile(code, filename);
  return module.exports;
}

async function svelteRenderer(data, locals) {
  const { buildSvelte } = requireOnly(
    path.resolve(__dirname, '../build/compile'),
  );
  const filename = data.path;
  const result = await buildSvelte(filename, { ssr: true, locals });
  return result;
}

// svelteRenderer.compile = function (data) {
//   return 'xx';
// };

// module.exports = ejsRenderer;

hexo.extend.renderer.register('svelte', 'html', svelteRenderer);

// hexo.extend.filter.register('after_render:js', function (str, data) {
//   hexo.load();
//   return str;
// });
