const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const memoize = require('lodash/memoize');

function getWebpackConfig(
  filename,
  { ssr, locals, baseConfig, assetPublicPath },
) {
  const entry = {
    main: path.resolve(
      __dirname,
      ssr ? '../src/main.server' : '../src/main.client',
    ),
  };

  const isProd = hexo.env.env === 'production';

  if (!ssr) {
    // 根据配置加载 highlightjs 主题
    entry['hljsTheme'] = require.resolve(
      `highlight.js/styles/${locals.theme.highlight.theme}.css`,
    );
  }

  return {
    mode: isProd ? 'production' : 'development',
    context: __dirname,
    // devtool: 'inline-cheap-source-map',
    entry,
    output: {
      publicPath: assetPublicPath,
      filename: ssr ? `ssr/[name].js` : `js/[name].[contenthash].js`,
      path: path.resolve(__dirname, '../source'),
      libraryTarget: ssr ? 'commonjs2' : 'umd',
    },
    target: ssr ? 'node' : 'web',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src'),
        '@shared': path.resolve(__dirname, '../shared'),
        '@components': path.resolve(__dirname, '../src/components'),
        ...(!ssr
          ? {
              // vue-meta 的 module 模块文件中 require 了 server-render，不能摇树去掉
              // 显示指定 client 部分不要包含 server render 的代码
              'vue-meta': 'vue-meta/dist/vue-meta.esm-browser.js',
            }
          : {}),
      },
      extensions: ['.mjs', '.js', '.ts', '.json'],
      mainFields: ['module', 'main'],
    },
    externals: ssr
      ? [
          nodeExternals({
            allowlist: /\.(css|vue)$/,
            additionalModuleDirs: [
              path.resolve(__dirname, '../node_modules'),
              path.resolve(process.cwd(), 'node_modules'),
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
        __dirname: JSON.stringify(path.resolve(__dirname, '..')),
        __PROD__: JSON.stringify(isProd),
        __SSR__: JSON.stringify(ssr),
        __PAGE_PATH__: JSON.stringify(filename),

        // some data inject
        __baseConfig: JSON.stringify(baseConfig),
        __theme: JSON.stringify(locals.theme),
        __site: JSON.stringify({
          count: {
            post: locals.site.posts.length,
            category: locals.site.categories.length,
            tag: locals.site.tags.length,
          },
        }),
      }),
      new FriendlyErrorsWebpackPlugin(),
      new WebpackManifestPlugin({
        fileName: `manifest.${ssr ? 'ssr' : 'client'}.json`,
      }),
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
  };
}

function formatFromStats(stats) {
  const json = stats.toJson({ chunks: true });

  // @see https://github.com/jantimon/html-webpack-plugin/blob/v3.0.7/index.js#L106
  const allChunks = json.chunks // filter
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
      const js = chunkFiles.find(chunkFile => /.js($|\?)/.test(chunkFile));

      js && result.js.push(js);

      // Gather all css files
      const css = chunkFiles.filter(chunkFile => /.css($|\?)/.test(chunkFile));

      result.css = [...result.css, ...css];

      return result;
    },
    { js: [], css: [] },
  );

  return {
    js,
    css,
    outputPath: json.outputPath,
  };
}

/**
 *
 * @param {*} filename
 * @param {*} options
 * @returns {import('webpack').Compiler}
 */
function getCompiler(filename, options) {
  return webpack([
    getWebpackConfig(filename, { ssr: true, ...options }),
    getWebpackConfig(filename, { ssr: false, ...options }),
  ]);
}

async function buildSPA(filename, { locals }) {
  const assetPublicPath = locals.url_for('/');

  const compiler = getCompiler(filename, {
    locals,
    baseConfig: locals.config,
    assetPublicPath,
  });

  const multiStats = await new Promise((resolve, reject) => {
    compiler.run((err, multiStats) => {
      const error = err || multiStats.hasErrors();
      if (error) {
        return reject(error);
      }

      resolve(multiStats);
    });
  });

  const [serverStats, clientStats] = multiStats.stats;
  const ssrResult = formatFromStats(serverStats);
  const clientResult = formatFromStats(clientStats);

  return { ssrResult, clientResult, publicPath: assetPublicPath };
}

let devComipler;

async function devBuildSPA(filename, { locals }) {
  const assetPublicPath = locals.url_for('/');

  if (!devComipler) {
    devComipler = getCompiler(filename, {
      locals,
      baseConfig: locals.config,
      assetPublicPath,
    });
  }

  const multiStats = await new Promise((resolve, reject) => {
    devComipler.run((err, multiStats) => {
      const error = err || multiStats.hasErrors();
      if (error) {
        return reject(error);
      }

      resolve(multiStats);
    });
  });

  const [serverStats, clientStats] = multiStats.stats;
  const ssrResult = formatFromStats(serverStats);
  const clientResult = formatFromStats(clientStats);

  return { ssrResult, clientResult, publicPath: assetPublicPath };
}

module.exports.buildSPA = memoize(buildSPA, () => 'SINGLE');
module.exports.devBuildSPA = devBuildSPA;
module.exports.formatFromStats = formatFromStats;
