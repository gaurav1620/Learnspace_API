const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(bodyParser.json());


const PORT = process.env.PORT || 6969;

require('./routes/')(app, db);

app.listen(PORT, () => {
    console.log(`APP is now running on port ${PORT}!`);
  })