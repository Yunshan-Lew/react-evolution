const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/api', {
    target: 'http://172.16.10.151:8084/',
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  }))
}
