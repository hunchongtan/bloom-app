const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://hci-chat-api-v7igm4swsq-de.a.run.app',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};
