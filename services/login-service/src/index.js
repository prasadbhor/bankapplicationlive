const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4001;

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'login-service' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  return res.json({
    token: 'dummy-jwt-token-for-' + username,
    message: 'Login successful (demo only, no real auth)',
    loginTime: new Date().toISOString()
  });
});

app.get('/login/status', (req, res) => {
  res.json({
    service: 'login-service',
    status: 'ACTIVE',
    version: '1.1.0'
  });
});

app.listen(PORT, () => {
  console.log(`login-service listening on port ${PORT}`);
});