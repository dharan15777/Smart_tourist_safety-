const express = require('express');
const app = express();
const port = process.env.PORT || 5006;

app.get('/', (req, res) => res.json({ message: 'Blockchain Service is running' }));

app.listen(port, () => console.log(`Blockchain Service listening on port ${port}`));
