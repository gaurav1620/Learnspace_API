const express = require('express');
const app = express();

const mysql = require('mysql');
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test',

})

app.get('/', (req, res) => {
  db.query('SELECT * FROM student', (err, dat) => {
    if(err){
      console.log(err);
      return res.status(400).send({"error" : "Error occured during exection of SQL query", "name": err.name, "desc" : err.description});
    }

    return res.send({"dat": dat});
  })
})

app.listen(8000, () => {
  console.log("APP is now running !");
})
