'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  devServer: {
    port: 8090,
    proxy: {
      '/api': {
        target: 'https://eitong.com',
        changeOrigin: true,
        pathRewrite: { '^/api': ''}
      }
    }
  },
  chainWebpack: config => {
    if (process.env.use_analyzer) {
      config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  css: {
    extract: { ignoreOrder: true },
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'cheap-module-eval-source-map'
    }
    config.resolve = {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('src'),
      },
      plugins: []
    }
  }
}
