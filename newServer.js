const express = require('express');
const db = require('./db');

const app = express();

const PORT = process.env.PORT || 6969;

require('./routes/')(app, db);

app.listen(PORT, () => {
    console.log(`APP is now running on port ${PORT}!`);
  })