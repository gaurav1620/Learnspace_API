const mysql = require('mysql');

module.exports = mysql.createPool({
    multipleStatements: true,
    user: 'b87fe6b7ea29e2',
    host: 'us-cdbr-east-02.cleardb.com',
    password: '982368df',
    database: 'heroku_d4f9118bf3983ba'
  })
