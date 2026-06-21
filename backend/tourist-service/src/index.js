const express = require('express');
const app = express();
const port = process.env.PORT || 5002;

app.get('/', (req, res) => res.json({ message: 'Tourist Service is running' }));

app.listen(port, () => console.log(`Tourist Service listening on port ${port}`));
