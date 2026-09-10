const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4001;

// Health check - used by CI/CD and Kubernetes readiness/liveness probes
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'login-service' });
});

// Dummy login endpoint - simulates OTP/credential check
app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  // In a real service: verify credentials, generate JWT, trigger OTP, etc.
  return res.json({
    token: 'dummy-jwt-token-for-' + username,
    message: 'Login successful (demo only, no real auth)'
  });
});

app.listen(PORT, () => {
  console.log(`login-service listening on port ${PORT}`);
});
