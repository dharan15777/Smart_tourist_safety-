const express = require('express');
const app = express();
const port = process.env.PORT || 5004;

app.get('/', (req, res) => res.json({ message: 'Tracking Service is running' }));

app.listen(port, () => console.log(`Tracking Service listening on port ${port}`));
