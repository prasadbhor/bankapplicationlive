const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4002;

// Dummy in-memory "database"
const accounts = {
  '1001': { id: '1001', name: 'A. Sharma', balance: 52340.75 },
  '1002': { id: '1002', name: 'R. Iyer', balance: 8120.00 }
};

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'account-service' });
});

// Get account details/balance
app.get('/account/:id', (req, res) => {
  const account = accounts[req.params.id];
  if (!account) return res.status(404).json({ error: 'Account not found' });
  res.json(account);
});

app.listen(PORT, () => {
  console.log(`account-service listening on port ${PORT}`);
});
