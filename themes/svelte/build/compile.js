const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { requireOnly, getBaseConfig } = require('./utils');
const fs = require('fs-extra');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');

async function build(filename, { ssr, locals, appHtml, pageData, baseConfig }) {
  const basename = path.basename(filename);
  const entry = path.resolve(__dirname, 'app/entry.js');

  const assetPublicPath = locals.url_for('/');

  const isGenerate = this.env.cmd === 'generate';

  return new Promise((resolve, reject) => {
    webpack(
      {
        mode: isGenerate ? 'production' : 'development',
        context: __dirname,
        entry,
        output: {
          publicPath: assetPublicPath,
          filename: ssr
            ? `ssr/${basename}.[contenthash].js`
            : `js/${basename}.[contenthash].js`,
          path: path.resolve(__dirname, '../source'),
          libraryTarget: ssr ? 'commonjs' : 'umd',
          library: ssr ? void 0 : '__app',
        },
        target: ssr ? 'node' : 'web',
        resolve: {
          extensions: ['.mjs', '.js', '.svelte', '.ts', '.json'],
          mainFields: ['svelte', 'browser', 'module', 'main'],
        },
        module: {
          rules: [
            {
              test: /\.svelte$/i,
              use: {
                loader: 'svelte-loader',
                options: {
                  preprocess: require('svelte-preprocess')({
                    typescript: {
                      tsconfigFile: path.resolve(__dirname, '../tsconfig.json'),
                    },
                  }),
                  compilerOptions: {
                    // additional compiler options here
                    generate: ssr ? 'ssr' : 'dom',
                    hydratable: !ssr,
                  },
                },
              },
            },
          ],
        },
        plugins: [
          !ssr &&
            new HtmlWebpackPlugin({
              filename: `tpl/${basename}.[contenthash].html`,
              inject: 'body',
              template: path.resolve(__dirname, 'app/tpl/index.ejs'),
              templateParameters: Object.assign({}, locals, {
                globalData: pageData,
                appHtml,
              }),
            }),
          new webpack.DefinePlugin(
            Object.assign(
              {
                __IS_GENERATE__: JSON.stringify(isGenerate),
                __SSR__: JSON.stringify(ssr),
                __PAGE_PATH__: JSON.stringify(filename),

                // some data inject
                __baseConfig: JSON.stringify(baseConfig),
                __theme: JSON.stringify(locals.theme),
              },
              ssr ? { __scoped: JSON.stringify(pageData) } : {},
            ),
          ),
          !isGenerate && new FriendlyErrorsWebpackPlugin(),
          !isGenerate &&
            new WebpackBar(
              ssr
                ? {
                    name: 'server',
                    color: 'orange',
                  }
                : {
                    name: 'client',
                  },
            ),
        ].filter(Boolean),
      },
      (err, stats) => {
        const error = err || stats.hasErrors();
        if (error) {
          return reject(error);
        }
        const json = stats.toJson();
        resolve({
          assets: json.assets,
          outputPath: json.outputPath,
        });
      },
    );
  });
}

async function buildSvelte(filename, { locals }) {
  const basename = path.basename(filename);

  let pageData = {};
  try {
    const { getData } = requireOnly(
      path.resolve(path.dirname(filename), `_${basename.split('.')[0]}.js`),
    );
    pageData = await getData({ locals });
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    }
  }

  const baseConfig = getBaseConfig(locals);

  // build ssr
  const ssrResult = await build.call(this, filename, {
    ssr: true,
    locals,
    pageData,
    baseConfig,
  });
  const { outputPath } = ssrResult;
  const ssrBundleAsset = ssrResult.assets.find(it => /.js$/i.test(it.name));
  const ssrfile = path.resolve(outputPath, ssrBundleAsset.name);
  // pre render
  const { html } = requireOnly(ssrfile).default.render();

  // build client
  const clientResult = await build.call(this, filename, {
    ssr: false,
    locals,
    appHtml: html,
    pageData,
    baseConfig,
  });

  const clientHtmlAsset = clientResult.assets.find(it =>
    /.html$/i.test(it.name),
  );

  return (
    fs.readFileSync(path.resolve(outputPath, clientHtmlAsset.name), {
      encoding: 'utf-8',
    }) || ''
  );
}

exports.build = build;
exports.buildSvelte = buildSvelte;
