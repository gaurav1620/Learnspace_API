const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const PORT = process.env.PORT || 8000;

const app = express();

const db = mysql.createPool({
  /*
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test',
   */
  multipleStatements: true,
  user: 'b5bd55a728c04c',
  host: 'us-cdbr-east-02.cleardb.com',
  password: 'd3895006',
  database: 'heroku_93cc4493cfbc7cc',
})

app.use(bodyParser.json());

app.get('/foo', (req, res) => {
  res.send({'foo':'bar'});
})

app.get('/droptables', (req, res) => {

  //const query = 'DROP TABLE IF EXISTS student; DROP TABLE IF EXISTS teacherl;DROP TABLE IF EXISTS classroom;';

  //*
  const query = '\
    DROP TABLE IF EXISTS student; \
    DROP TABLE IF EXISTS teacher; \
    DROP TABLE IF EXISTS classroom; \
    DROP TABLE IF EXISTS assignment; \
    DROP TABLE IF EXISTS submissions; \
    DROP TABLE IF EXISTS attachments; \
    CREATE TABLE student (\
      _id INT PRIMARY KEY AUTO_INCREMENT,\
      fname VARCHAR(50) NOT NULL,\
      lname VARCHAR(50) NOT NULL,\
      email VARCHAR(50) NOT NULL UNIQUE,\
      password VARCHAR(50) NOT NULL,\
      year VARCHAR(50) NOT NULL,\
      department VARCHAR(50) NOT NULL\
    );\
    CREATE TABLE teacher (\
      _id INT PRIMARY KEY AUTO_INCREMENT,\
      fname VARCHAR(50) NOT NULL,\
      lname VARCHAR(50) NOT NULL,\
      email VARCHAR(50) NOT NULL UNIQUE,\
      password VARCHAR(50) NOT NULL\
    );\
    CREATE TABLE classroom (\
      _id INT PRIMARY KEY AUTO_INCREMENT,\
      teacher_id INT NOT NULL,\
      name VARCHAR(50) NOT NULL,\
      description VARCHAR(200)\
    );\
    CREATE TABLE assignment (\
      _id INT PRIMARY KEY AUTO_INCREMENT,\
      classroom_id INT NOT NULL,\
      description VARCHAR(200)\
    );\
    CREATE TABLE submissions (\
      _id INT PRIMARY KEY AUTO_INCREMENT,\
      data BLOB NOT NULL,\
      assignment_id INT NOT NULL,\
      student_id INT NOT NULL\
    );\
    CREATE TABLE attachments (\
      _id INT PRIMARY KEY AUTO_INCREMENT,\
      data BLOB NOT NULL,\
      assignment_id INT NOT NULL\
    );';
  db.query(query, (err, dat) => {
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

app.get('/students/:id', (req, res) => {
  const query = `SELECT * FROM student WHERE _id=${req.params.id}`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.post('/teachers', (req, res) => {
  console.log(req.body);
  const query = `INSERT INTO teacher(fname, lname, email, password) VALUES('${req.body.fname}', '${req.body.lname}', '${req.body.email}', '${req.body.password}');`;
  console.log(query);
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/teachers', (req, res) => {
  const query = 'SELECT * FROM teacher';
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/teachers/:id', (req, res) => {
  const query = `SELECT * FROM teacher WHERE _id=${req.params.id}`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.post('/classroom', (req, res) => {
  const query = `INSERT INTO classroom(teacher_id, name, description) VALUES('${req.body.teacher_id}, ${req.body.name}', '${req.body.description}');`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/classroom/:id', (req,res) => {
  const query = `SELECT * FROM classroom WHERE _id=${req.params.id}`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
}) 

app.post('/assignment', (req, res) => {
  const query = `INSERT INTO assignment(classroom_id, description) VALUES('${req.body.classroom_id}, ${req.body.description}');`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/assignment/:classroom_id', (req,res) => {
  const query = `SELECT * FROM classroom WHERE classroom_id=${req.params.classroom_id}`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
}) 

app.get('/describe/:tablename', (req, res)=>{
  const query = `DESCRIBE ${req.params.tablename};`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.listen(PORT, () => {
  console.log(`APP is now running on port ${PORT}!`);
})
