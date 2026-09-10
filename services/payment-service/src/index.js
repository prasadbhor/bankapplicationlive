const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4003;

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'payment-service' });
});

// Dummy transfer endpoint
app.post('/payment/transfer', (req, res) => {
  const { fromAccount, toAccount, amount } = req.body || {};
  if (!fromAccount || !toAccount || !amount) {
    return res.status(400).json({ error: 'fromAccount, toAccount and amount are required' });
  }
  // In a real service: call account-service, run fraud checks,
  // publish a "transaction.completed" event to Kafka, etc.
  return res.json({
    status: 'SUCCESS',
    transactionId: 'TXN-' + Date.now(),
    message: `Transferred ${amount} from ${fromAccount} to ${toAccount} (demo only)`
  });
});

app.listen(PORT, () => {
  console.log(`payment-service listening on port ${PORT}`);
});
