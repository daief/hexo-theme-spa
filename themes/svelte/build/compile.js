const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { requireOnly } = require('./utils');
const fs = require('fs-extra');

async function build(filename, { ssr, locals, appHtml }) {
  const basename = path.basename(filename);
  const entry = path.resolve(__dirname, 'app/entry.js');

  const assetPublicPath = locals.url_for('/');

  return new Promise((resolve, reject) => {
    webpack(
      {
        context: __dirname,
        entry,
        output: {
          filename: ssr ? `${basename}.js` : `${basename}.[contenthash].js`,
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
              filename: `${basename}.[contenthash].html`,
              publicPath: assetPublicPath,
              inject: 'body',
              template: path.resolve(__dirname, 'app/tpl/index.ejs'),
              templateParameters: Object.assign({}, locals, { appHtml }),
            }),
          new webpack.DefinePlugin({
            __SSR__: JSON.stringify(ssr),
            __PAGE_PATH__: JSON.stringify(filename),
            __$$state__: JSON.stringify({
              a: {
                name: 'name',
                hos: {
                  asd: 2,
                },
              },
            }),
          }),
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

async function buildSvelte(filename, { ssr, locals }) {
  const basename = path.basename(filename);
  const { outputPath } = await build(filename, { ssr: true, locals });

  const ssrfile = path.resolve(outputPath, `${basename}.js`);
  const { html, css, head } = requireOnly(ssrfile).default.render();

  const clientResult = await build(filename, {
    ssr: false,
    locals,
    appHtml: html,
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
