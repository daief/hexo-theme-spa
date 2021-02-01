const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { requireOnly, getBaseConfig } = require('./utils');
const fs = require('fs-extra');
const WebpackBar = require('webpackbar');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

async function build(
  filename,
  { hexo, ssr, locals, appHtml, pageData, baseConfig },
) {
  const basename = path.basename(filename);
  const entry = path.resolve(__dirname, 'app/entry.js');

  const assetPublicPath = locals.url_for('/');
  const isGenerate = hexo.env.cmd === 'generate';

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
          alias: {
            '@': path.resolve(__dirname, '../src'),
            '@shared': path.resolve(__dirname, '../shared'),
            '@components': path.resolve(__dirname, '../layout/_components'),
          },
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
            {
              test: /\.tsx?$/i,
              use: {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true,
                  configFile: path.resolve(__dirname, '../tsconfig.json'),
                  appendTsSuffixTo: [/\.svelte$/],
                },
              },
            },
            !ssr && {
              test: /\.less$/i,
              use: [
                {
                  loader: 'style-loader',
                },
                {
                  loader: 'css-loader',
                },
                {
                  loader: 'less-loader',
                  options: {
                    lessOptions: {
                      javascriptEnabled: true,
                    },
                  },
                },
              ],
            },
            !ssr && {
              test: /\.css$/i,
              use: ['style-loader', 'css-loader'],
            },
            ssr && {
              test: /\.(css)|(less)$/i,
              loader: 'null-loader',
            },
          ].filter(Boolean),
        },
        plugins: [
          // !ssr &&
          //   new HtmlWebpackPlugin({
          //     filename: `tpl/${basename}.[contenthash].html`,
          //     inject: 'body',
          //     template: path.resolve(__dirname, 'app/tpl/index.ejs'),
          //     templateParameters: Object.assign({}, locals, {
          //       globalData: pageData,
          //       appHtml,
          //     }),
          //   }),
          new webpack.DefinePlugin({
            __IS_GENERATE__: JSON.stringify(isGenerate),
            __SSR__: JSON.stringify(ssr),
            __PAGE_PATH__: JSON.stringify(filename),

            // some data inject
            __baseConfig: JSON.stringify(baseConfig),
            __theme: JSON.stringify(locals.theme),
          }),
          new FriendlyErrorsWebpackPlugin(),
          // new WebpackBar(
          //   ssr
          //     ? {
          //         name: 'server',
          //         color: 'orange',
          //       }
          //     : {
          //         name: 'client',
          //       },
          // ),
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

async function buildSvelte(filename, { locals, hexo }) {
  const ssrResult = await build(filename, {
    hexo,
    ssr: true,
    locals,
    pageData: {},
    baseConfig: {},
  });

  const clientResult = await build.call(this, filename, {
    hexo,
    ssr: false,
    locals,
    appHtml: '',
    pageData: {},
    baseConfig: {},
  });

  return { ssrResult, clientResult };

  // const basename = path.basename(filename);
  // const pageData = {};
  // const baseConfig = getBaseConfig(locals);
  // // build ssr
  // const ssrResult = await build.call(this, filename, {
  //   ssr: true,
  //   locals,
  //   pageData,
  //   baseConfig: {},
  // });
  // const { outputPath } = ssrResult;
  // const ssrBundleAsset = ssrResult.assets.find(it => /.js$/i.test(it.name));
  // const ssrfile = path.resolve(outputPath, ssrBundleAsset.name);
  // // pre render
  // const { html } = requireOnly(ssrfile).default.render();
  // // build client
  // const clientResult = await build.call(this, filename, {
  //   ssr: false,
  //   locals,
  //   appHtml: html,
  //   pageData,
  //   baseConfig,
  // });
  // const clientHtmlAsset = clientResult.assets.find(it =>
  //   /.html$/i.test(it.name),
  // );
  // return (
  //   fs.readFileSync(path.resolve(outputPath, clientHtmlAsset.name), {
  //     encoding: 'utf-8',
  //   }) || ''
  // );
}

exports.build = build;
exports.buildSvelte = buildSvelte;
