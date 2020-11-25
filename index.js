const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql-ssh');

const PORT = process.env.PORT || 8000;

const app = express();

var connection = mysql.connect(
    {
        host: 'ec2-3-82-248-102.compute-1.amazonaws.com',
        port: 69,
        user: 'rterror',
        password: 'runtimeterror'
    },
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'RuntimeTerror@123',
        database: 'testone'
    }
).catch(e => {
    console.log(e);
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
  connection.then(client => {
    client.query("SELECT * FROM student;", (err, data) => {
      if (err)
        return res.status(400).send({ "success": false, "error": err.name, "message": err.message });
      return res.send({ "success": true, "data": data });
    });
  })
})

app.get('/student/:id', (req, res) => {
  var id = req.params.id;
  connection.then(client => {
    client.query("SELECT * FROM student where student_id = ?;", [id], (err, data) => {
      if (err)
        return res.status(400).send({ "success": false, "error": err.name, "message": err.message });
      return res.send({ "success": true, "data": data });
    });
  })
})

app.get('/foo', (req, res) => {
  res.send({'foo':'bar'});
})

  app.listen(PORT, () => {
    console.log(`APP is now running on port ${PORT}!`);
})