/**
 * 请不要改动此文件，否则更新配置会造成你的改动被覆盖
 **/
'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const settings = require('./settings');
const time = new Date();
let fixed = (num) => {return num < 10 ? `0${num}` : num;}

let year = time.getFullYear(),
  month = fixed(time.getMonth() + 1),
  day = fixed(time.getDate()),
  hour = fixed(time.getHours()),
  minute = fixed(time.getMinutes());
const timestamp = `${year}${month}${day}${hour}${minute}`;

const dev_config = {
  index: path.resolve(__dirname, `../${settings.packageName}-page-debug-${timestamp}/index.html`),
  assetsRoot: path.resolve(__dirname, `../${settings.packageName}-page-debug-${timestamp}`),
  assetsSubDirectory: 'resource',
  assetsPublicPath: './'
};

const prod_config = {
  index: path.resolve(__dirname, `../${settings.packageName}-page-release-${timestamp}/index.html`),
  assetsRoot: path.resolve(__dirname, `../${settings.packageName}-page-release-${timestamp}`),
  assetsSubDirectory: 'resource',
  assetsPublicPath: './'
};

const config = process.env.NODE_ENV === 'production'
  ? prod_config : dev_config;

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'resource',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'https://www.wanandroid.com',
        changeOrigin: true,
        pathRewrite: {
          '^api': ''
        }
      }
    },

    // Various Dev Server settings
    host: settings.dev.host, // can be overwritten by process.env.HOST
    port: settings.dev.port, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: config.index,

    // Paths
    assetsRoot: config.assetsRoot,
    assetsSubDirectory: config.assetsSubDirectory,
    assetsPublicPath: config.assetsPublicPath,

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: false
  }
}
