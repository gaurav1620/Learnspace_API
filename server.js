const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const multer  = require('multer')

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());

require('./routes')(app);
const db = require('./database');

app.use(bodyParser.json());
var upload = multer({ dest: 'uploads/' })
app.use(fileUpload());

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
      marks_obtained INT(3),\
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


app.get('/marks/:assignment_id', (req, res) => {
  const query = `SELECT submissions.marks_obtained, student.fname, student.lname FROM submissions LEFT JOIN student on submissions.student_id=student._id WHERE submissions.assignment_id=${assignment_id};`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})








//TEACHER










//COURSE

//create new course






 

 

 


//course existence check


//remove student from course



//RECORDS

//join course







app.get('/coursesenrolled/:student_id', (req,res) => {
  const query = `SELECT * from course WHERE _id IN(SELECT course_id FROM records WHERE student_id=${req.params.student_id});`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.post('/assignment', (req, res) => {
  const query = `INSERT INTO assignment(course_id, title, description, due_date, max_marks, is_study_material)\
                 VALUES(${req.body.course_id}, '${req.body.title}', '${req.body.description}', '${req.body.due_date}', ${req.body.max_marks}, ${req.body.is_study_material});`;
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
app.get('/assignment', (req,res) => {
  const query = `SELECT * FROM assignment;`;
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

app.post('/attachments',upload.single('file'), (req, res) => {
  /*
  if(!req.files){
    res.send({
        status: false,
        message: 'No file uploaded'
    });
  }
   */
  const file = req.file;
  const query = `INSERT INTO attachments(data, assignment_id, name, description)\
                 VALUES(${file}, ${req.body.assignment_id}, '${req.body.name}', '${req.body.description}');`;
  console.log(query);
  console.log(typeof(typeof(file)));
  console.log(req.body);
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/attachmentsfile/:id', (req, res) => {
  const query = `SELECT * from attachments WHERE _id=${req.params.id};`
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.sendFile(data[0].data);
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

app.post('/submissions', upload.single('file') , (req, res) => {
  const file = req.file;
  const query = `INSERT INTO submissions(data, assignment_id, student_id)\
                 VALUES(${file}, ${req.body.assignment_id}, '${req.body.student_id}');`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/updatesubmissionstable', (req,res) => {
  const query = 'ALTER TABLE submissions MODIFY data BLOB;'
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/submissions', (req, res) => {
  const query = `SELECT * FROM submissions;`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/submissionsfile/:assignment_id/:student_id', (req, res) => {
  const query = `SELECT * from submissions WHERE assignment_id='${req.params.assignment_id}' AND student_id=${req.params.student_id};`
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.sendFile(data[0].data);
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

app.post('/gradesubmission/:sub_id', (req,res) => {
  console.log("marks : ",req.body.marks);
  const query = `UPDATE submissions SET marks_obtained=${req.body.marks} WHERE _id=${req.params.sub_id};`;
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

app.get('/get_report/:assignment_id', (req, res)=>{
  const query =`CALL send_report('${req.param.assignment_id}')`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.post('/notes', (req, res) => {
  const query = `INSERT INTO notes(user_id, user_type, day, date, time, content)\
                 VALUES(${req.body.user_id}, '${req.body.user_type}', '${req.body.day}', '${req.body.date}', '${req.body.time}', '${req.body.content}');`;
  db.query(query, (err, data) => {
    if(err){    
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    }
    return res.send({"success":true, "data" : data});
  })
})

app.get('/notes', (req, res) => {
  const query = `SELECT * FROM notes;`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.get('/notes/:user_type/:id', (req,res) => {
  const query = `SELECT * FROM notes WHERE user_id=${req.params.id} and user_type='${req.params.user_type}';`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
}) 

app.delete('/notes/:_id', (req, res) => {
  const query = `DELETE FROM notes WHERE _id=${req.params._id};`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})

app.listen(PORT, () => {
  console.log(`APP is now running on port ${PORT}!`);
})
