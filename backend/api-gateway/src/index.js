const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => res.json({ message: 'API Gateway is running' }));

app.listen(port, () => console.log(`API Gateway listening on port ${port}`));
