const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

async function build(filename, { hexo, ssr, locals, baseConfig }) {
  const basename = path.basename(filename);
  const entry = path.resolve(__dirname, '../src/main');

  const assetPublicPath = locals.url_for('/');
  const isProd = hexo.env.env === 'production';

  return new Promise((resolve, reject) => {
    webpack(
      {
        mode: isProd ? 'production' : 'development',
        context: __dirname,
        // devtool: 'inline-cheap-source-map',
        entry,
        output: {
          publicPath: assetPublicPath,
          filename: ssr
            ? `ssr/${basename}.[contenthash].js`
            : `js/${basename}.[contenthash].js`,
          path: path.resolve(__dirname, '../source'),
          libraryTarget: ssr ? 'commonjs2' : 'umd',
        },
        target: ssr ? 'node' : 'web',
        resolve: {
          alias: {
            '@': path.resolve(__dirname, '../src'),
            '@shared': path.resolve(__dirname, '../shared'),
            '@components': path.resolve(__dirname, '../src/components'),
          },
          extensions: ['.mjs', '.js', '.ts', '.json'],
          mainFields: ['main', 'module'],
        },
        externals: ssr
          ? [
              nodeExternals({
                allowlist: /\.(css|vue)$/,
                additionalModuleDirs: [
                  path.resolve(__dirname, '../node_modules'),
                ],
              }),
            ]
          : [],
        module: {
          rules: [
            {
              test: /\.vue$/,
              use: 'vue-loader',
            },
            {
              test: /\.tsx?$/i,
              use: {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true,
                  configFile: path.resolve(__dirname, '../tsconfig.json'),
                  appendTsSuffixTo: [/\.vue$/],
                },
              },
            },
            !ssr && {
              test: /\.less$/i,
              use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      config: path.resolve(__dirname, '../postcss.config.js'),
                    },
                  },
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
              use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      config: path.resolve(__dirname, '../postcss.config.js'),
                    },
                  },
                },
              ],
            },
            ssr && {
              test: /\.(css)|(less)$/i,
              loader: 'null-loader',
            },
            {
              test: [
                /\.(png|jpe?g|gif|webp|svg)$/,
                /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
                /\.(woff2?|eot|ttf|otf)$/i,
              ],
              use: [
                {
                  loader: 'url-loader',
                  options: {
                    limit: 8192,
                  },
                },
              ],
            },
          ].filter(Boolean),
        },
        plugins: [
          new VueLoaderPlugin(),
          new webpack.DefinePlugin({
            __PROD__: JSON.stringify(isProd),
            __SSR__: JSON.stringify(ssr),
            __PAGE_PATH__: JSON.stringify(filename),

            // some data inject
            __baseConfig: JSON.stringify(baseConfig),
            __theme: JSON.stringify(locals.theme),
          }),
          new FriendlyErrorsWebpackPlugin(),
          new WebpackManifestPlugin({
            fileName: `manifest.${ssr ? 'ssr' : 'client'}.json`,
          }),
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
          !ssr &&
            new MiniCssExtractPlugin({
              filename: 'css/dist.[contenthash].css',
            }),
        ].filter(Boolean),
        optimization: ssr
          ? {}
          : {
              splitChunks: {
                cacheGroups: {
                  libs: {
                    test: /\/node_modules\//,
                    enforce: true,
                  },
                },
              },
            },
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

async function buildSPA(filename, { locals, hexo }) {
  const ssrResult = await build(filename, {
    hexo,
    ssr: true,
    locals,
    baseConfig: locals.config,
  });

  const clientResult = await build.call(this, filename, {
    hexo,
    ssr: false,
    locals,
    baseConfig: locals.config,
  });

  return { ssrResult, clientResult };
}

exports.build = build;
exports.buildSPA = buildSPA;
