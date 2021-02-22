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
  const entry = {
    main: path.resolve(__dirname, '../src/main'),
  };

  const assetPublicPath = locals.url_for('/');
  const isProd = hexo.env.env === 'production';

  if (!ssr) {
    // 根据配置加载 highlightjs 主题
    entry['hljsTheme'] = require.resolve(
      `highlight.js/styles/${locals.theme.highlight.theme}.css`,
    );
  }

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
              loader: 'vue-loader',
              options: {
                compilerOptions: {
                  directiveTransforms: {},
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
                chunks: 'all',
                cacheGroups: {
                  libs: {
                    test: /\/node_modules\//,
                    enforce: true,
                    name: 'libs',
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

        // @see https://github.com/jantimon/html-webpack-plugin/blob/v3.0.7/index.js#L106
        const allChunks = stats
          .toJson({ chunks: true })
          .chunks // filter
          .filter(chunk => {
            const chunkName = chunk.names[0];
            // This chunk doesn't have a name. This script can't handled it.
            if (chunkName === undefined) {
              return false;
            }
            // Skip if the chunk should be lazy loaded
            if (typeof chunk.isInitial === 'function') {
              if (!chunk.isInitial()) {
                return false;
              }
            }

            return chunk.initial;
          });

        const { js, css } = allChunks.reduce(
          (result, chunk) => {
            const chunkFiles = chunk.files || [];
            const js = chunkFiles.find(chunkFile =>
              /.js($|\?)/.test(chunkFile),
            );

            js && result.js.push(js);

            // Gather all css files
            const css = chunkFiles.filter(chunkFile =>
              /.css($|\?)/.test(chunkFile),
            );

            result.css = [...result.css, ...css];

            return result;
          },
          { js: [], css: [] },
        );

        resolve({
          assets: json.assets,
          outputPath: json.outputPath,
          js,
          css,
          publicPath: assetPublicPath,
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
