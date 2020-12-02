const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const mysql = require('mysql');
const credentials = require('./credentials');

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());

const db = mysql.createPool({
  /*
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test',
   */
  multipleStatements: true,
  host: credentials.host,
  user: credentials.user,
  password: credentials.password,
  database: credentials.database,
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
    DROP TABLE IF EXISTS course; \
    DROP TABLE IF EXISTS assignment; \
    DROP TABLE IF EXISTS records; \
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
    CREATE TABLE course (\
      _id INT PRIMARY KEY AUTO_INCREMENT,\
      teacher_id INT NOT NULL,\
      name VARCHAR(50) NOT NULL,\
      description VARCHAR(200),\
      year VARCHAR(4),\
      department VARCHAR(10)\
      course_code VARCHAR(10) NOT NULL UNIQUE\
    );\
    CREATE TABLE records(\
      student_id INT,\
      course_code VARCHAR(10),\
      PRIMARY KEY (student_id, course_id)\
    );\
    CREATE TABLE assignment (\
      _id INT PRIMARY KEY AUTO_INCREMENT,\
      course_id INT NOT NULL,\
      description VARCHAR(200),\
      due_date DATE,\
      max_marks INT(3),\
      is_study_material BOOLEAN NOT NULL\
    );\
    CREATE TABLE submissions (\
      data BLOB NOT NULL,\
      assignment_id INT NOT NULL,\
      student_id INT NOT NULL,\
      marks_obtained INT(3) NOT NULL,\
      PRIMARY KEY (assignment_id, student_id)\
    );\
    CREATE TABLE attachments (\
      _id INT PRIMARY KEY AUTO_INCREMENT,\
      data BLOB NOT NULL,\
      assignment_id INT NOT NULL,\
      name VARCHAR(100) NOT NULL,\
      description VARCHAR(200)\
    );';
  db.query(query, (err, dat) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true});
  })
})


//STUDENT
app.post('/student', (req, res) => {
  console.log(req.body);
  const query = `INSERT INTO student(fname, lname, email, password, year, department) VALUES('${req.body.fname}', '${req.body.lname}', '${req.body.email}', '${req.body.password}', '${req.body.year}', '${req.body.department}');`;
  console.log(query);
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/student', (req, res) => {
  const query = 'SELECT * FROM student;';
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/student/:id', (req, res) => {
  const query = `SELECT * FROM student WHERE _id=${req.params.id};`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.post('/student_login', (req, res) => {
  const query = `SELECT * FROM student WHERE email = '${req.body.email}' AND password = '${req.body.password}'`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    if(data == '')
      return res.send({"student": "not found"});
    return res.send({"student": "found", "data": data});
  })
})


//TEACHER
app.post('/teacher', (req, res) => {
  console.log(req.body);
  const query = `INSERT INTO teacher(fname, lname, email, password) VALUES('${req.body.fname}', '${req.body.lname}', '${req.body.email}', '${req.body.password}');`;
  console.log(query);
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/teacher', (req, res) => {
  const query = 'SELECT * FROM teacher;';
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/teacher/:id', (req, res) => {
  const query = `SELECT * FROM teacher WHERE _id=${req.params.id};`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})
app.post('/teacher_login', (req, res) => {
  const query = `SELECT * FROM teacher WHERE email = '${req.body.email}' AND password = '${req.body.password}';`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    if(data == '')
      return res.send({"teacher": "not found"});
    return res.send({"teacher": "found", "data": data});
  })
})


//COURSE

//create new course
app.post('/course', (req, res) => {
  const query = `INSERT INTO course(teacher_id, name, description, year, department, course_code)\
                 VALUES(${req.body.teacher_id}, '${req.body.name}', '${req.body.description}', '${req.body.year}', '${req.body.department}', '${req.body.course_code}');`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/course', (req,res) => {
  const query = `SELECT * FROM course;`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
}) 

app.get('/course/:course_code', (req,res) => {
  const query = `SELECT * FROM course WHERE course_code='${req.params.course_code}';`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
}) 

//course existence check
app.post('/course_check', (req, res) => {
  const query = `SELECT * FROM course WHERE course_code='${req.body.course_code}';`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})


//RECORDS

//join course
app.post('/records', (req, res) => {
  const query = `INSERT INTO records(student_id, course_id)\
                 VALUES(${req.body.student_id}, ${req.body.course_id});`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/records', (req, res) => {
  const query = 'SELECT * FROM records;';
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/records/:course_id', (req,res) => {
  const query = `SELECT * FROM student WHERE _id IN(SELECT student_id FROM records WHERE course_id=${req.params.course_id});`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})


app.get('/coursesenrolled/:student_id', (req,res) => {
  const query = `SELECT * from course WHERE _id IN(SELECT course_id FROM records WHERE student_id=${req.params.student_id});`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.post('/assignment', (req, res) => {
  const query = `INSERT INTO assignment(course_id, description, due_date,max_marks, is_study_material)\
                 VALUES(${req.body.course_id}, '${req.body.description}', '${req.body.due_date}', ${req.body.max_marks}, ${req.body.is_study_material});`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/assignmentbyid/:id', (req,res) => {
  const query = `SELECT * FROM assignment WHERE _id=${req.params.id}`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

// get all assignments in a classroom 
app.get('/assignment/:course_id', (req,res) => {
  const query = `SELECT * FROM assignment WHERE course_id=${req.params.course_id};`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
}) 

app.post('/attachments', (req, res) => {
  const query = `INSERT INTO attachments(data, assignment_id, name, description)\
                 VALUES(${req.body.data}, ${req.body.assignment_id}, '${req.body.name}', '${req.body.description}');`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

//get a particular attachment
app.get('/attachmentsbyid/:id', (req,res) => {
  const query = `SELECT * FROM attachments WHERE _id=${req.params.id};`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

// get all the attachemnts for a particular assignment
app.get('/attachments/:assignment_id', (req,res) => {
  const query = `SELECT * FROM attachments WHERE assignment_id=${req.params.assignment_id};`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
}) 

app.post('/submissions', (req, res) => {
  const query = `INSERT INTO submissions(data, assignment_id, student_id, marks_obtained)\
                 VALUES(${req.body.data}, ${req.body.assignment_id}, '${req.body.name}', '${req.body.description}');`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

// returns all submissions for a particular assignment
app.get('/submissions/:assignment_id', (req,res) => {
  const query = `SELECT * FROM submissions WHERE assignment_id=${req.params.assignment_id};`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
}) 


app.get('/submissions/:assignment_id/:student_id', (req,res) => {
  const query = `SELECT * FROM submissions WHERE assignment_id=${req.params.assignment_id} AND student_id=${req.params.student_id};`;
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
