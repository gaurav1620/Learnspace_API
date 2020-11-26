const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8000;

const app = express();

const mysql = require('mysql');
const db = mysql.createPool({
  /*
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test',
   */
  user: 'b5bd55a728c04c',  
  host: 'us-cdbr-east-02.cleardb.com',
  password: 'd3895006',
  database: 'heroku_93cc4493cfbc7cc',
})

app.use(bodyParser.json());

app.get('/deleteschema', (req, res) => {
  db.query('DROP TABLE student;', (err, dat) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true});
  })
})

app.get('/updateschema', (req, res) => {
  db.query('CREATE TABLE student (_id INT PRIMARY KEY AUTO_INCREMENT,fname VARCHAR(50) NOT NULL, lname VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(50) NOT NULL, year VARCHAR(50) NOT NULL, department VARCHAR(50) NOT NULL);', (err, dat) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true});
  })
})

app.post('/students', (req, res) => {
  console.log(req.body);
  const query = `INSERT INTO student(fname, lname, email, password, year, department) VALUES('${req.body.fname}', '${req.body.lname}', '${req.body.email}', '${req.body.password}', '${req.body.year}', '${req.body.department}');`;
  console.log(query);
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/students', (req, res) => {
  const query = 'SELECT * FROM student';
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

// app.get('/student/:id', (req, res) => {
//   var id = req.params.id;
//   const query = 'SELECT * FROM student where student_id = ?';
//   db.query(query, id, (err, data) => {
//     if(err)
//       return res.status(400).send({"success":false, "error":err.name, "message": err.message});
//     return res.send({"success":true, "data" : data});
//   })
// })

app.get('/foo', (req, res) => {
  res.send({'foo':'bar'});
})

  app.listen(PORT, () => {
    console.log(`APP is now running on port ${PORT}!`);
})