const express = require('express');
const app = express();
const port = process.env.PORT || 5005;

app.get('/', (req, res) => res.json({ message: 'Notification Service is running' }));

app.listen(port, () => console.log(`Notification Service listening on port ${port}`));
