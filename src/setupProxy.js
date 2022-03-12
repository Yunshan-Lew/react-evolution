const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/api', {
    target: 'https://web.wwuche.com/api/',
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  }))
}
