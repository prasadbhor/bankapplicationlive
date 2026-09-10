const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 4000;

// Service URLs - in Docker Compose these resolve via container names,
// in Kubernetes these would be Service DNS names instead.
const LOGIN_SERVICE_URL   = process.env.LOGIN_SERVICE_URL   || 'http://login-service:4001';
const ACCOUNT_SERVICE_URL = process.env.ACCOUNT_SERVICE_URL || 'http://account-service:4002';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:4003';

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'api-gateway' });
});

// Route by path prefix to the correct microservice
app.use('/login', createProxyMiddleware({ target: LOGIN_SERVICE_URL, changeOrigin: true, pathRewrite: { '^/login': '/login' } }));
app.use('/account', createProxyMiddleware({ target: ACCOUNT_SERVICE_URL, changeOrigin: true, pathRewrite: { '^/account': '/account' } }));
app.use('/payment', createProxyMiddleware({ target: PAYMENT_SERVICE_URL, changeOrigin: true, pathRewrite: { '^/payment': '/payment' } }));

app.listen(PORT, () => {
  console.log(`api-gateway listening on port ${PORT}`);
  console.log(`Routing: /login -> ${LOGIN_SERVICE_URL}, /account -> ${ACCOUNT_SERVICE_URL}, /payment -> ${PAYMENT_SERVICE_URL}`);
});
