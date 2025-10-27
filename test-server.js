const express = require('express');
const app = express();
const port = 3006;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Test server is running' });
});

app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});
