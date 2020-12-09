const express = require('express');
const fs = require('fs');
const cors = require('cors')
const bodyParser = require('body-parser');
const mysql = require('mysql');
const credentials = require('./credentials');
const fileUpload = require('express-fileupload');
const multer  = require('multer')
const serveIndex = require('serve-index');

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
app.use(express.static(__dirname + "/"))
app.use('/uploads', serveIndex(__dirname + '/uploads'));

var upload = multer({ dest: 'uploads/' })

app.use(fileUpload({
    createParentPath: true
}));
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
      is_assignment BOOLEAN NOT NULL\
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
app.post('/student', (req, res) => {
  console.log(req.body);
  const query = `INSERT INTO student(fname, lname, email, password, year, department) VALUES('${req.body.fname}', '${req.body.lname}', '${req.body.email}', '${req.body.password}', '${req.body.year}', '${req.body.department}');`;
  console.log(query);
  db.query(query, (err, data) => {
    if(err){
      if(err.message.includes('ER_DUP_ENTRY')){
        return res.send({"success":false, "reason": "Email exists"});
      }
      else return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    }
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

app.get('/marks/:assignment_id', (req, res) => {
  const query = `SELECT submissions.marks_obtained, student._id  AS student_id, student.fname, student.lname FROM submissions LEFT JOIN student on submissions.student_id=student._id WHERE submissions.assignment_id=${req.params.assignment_id};`;
  db.query(query, (err, submitted) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    const query1 = `SELECT _id, fname, lname FROM student WHERE _id IN(SELECT student_id FROM records WHERE course_id IN (SELECT course_id FROM assignment WHERE _id = ${req.params.assignment_id})) AND _id NOT IN (SELECT student_id FROM submissions WHERE assignment_id=${req.params.assignment_id});`;
    db.query(query1, (err,notSubmitted)=>{
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "submitted" : submitted, "not_submitted": notSubmitted});
    })
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

app.post('/updatestudentname', (req, res) => {
  console.log(req.body);
  const query = `UPDATE student SET fname='${req.body.fname}', lname='${req.body.lname}' WHERE email='${req.body.email}';`
  console.log(query);
  db.query(query, (err, data) => {
    if(err){
      if(err.message.includes('ER_DUP_ENTRY')){
        return res.send({"success":false, "reason": "Email exists"});
      }
      else return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    }
    return res.send({"success":true, "data" : data});
  })
})


//TEACHER
app.post('/teacher', (req, res) => {
  console.log(req.body);
  const query = `INSERT INTO teacher(fname, lname, email, password) VALUES('${req.body.fname}', '${req.body.lname}', '${req.body.email}', '${req.body.password}');`;
  console.log(query);
  db.query(query, (err, data) => {
    if(err){
      if(err.message.includes('ER_DUP_ENTRY')){
        return res.send({"success":false, "reason": "Email exists"});
      }
      else return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    }
    return res.send({"success":true, "data" : data});
  })
})

app.post('/updateteachername', (req, res) => {
  console.log(req.body);
  const query = `UPDATE teacher SET fname='${req.body.fname}', lname='${req.body.lname}' WHERE email='${req.body.email}';`
  console.log(query);
  db.query(query, (err, data) => {
    if(err){
      if(err.message.includes('ER_DUP_ENTRY')){
        return res.send({"success":false, "reason": "Email exists"});
      }
      else return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    }
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
    if(err){
      if(err.message.includes('ER_DUP_ENTRY')){
        return res.send({"success":false, "reason": "course code exists"});
      }
      else return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    }
    return res.send({"success":true, "data" : data});
  })
})

app.delete('/course', (req, res) => {
  const course_code = req.body.course_code;
  const course_id = req.body.course_id;

  const query = `
  DELETE FROM submissions WHERE assignment_id IN (SELECT _id FROM assignment WHERE course_id=${course_id});
  DELETE FROM attachments WHERE assignment_id IN (SELECT _id FROM assignment WHERE course_id=${course_id});
  DELETE FROM assignment WHERE course_id=${course_id};
  DELETE FROM records WHERE course_id=${course_id};
  DELETE FROM course WHERE course_code=${course_code};
  `;
  db.query(query, (err, data) => {
    if(err){
      if(err.message.includes('ER_DUP_ENTRY')){
        return res.send({"success":false, "reason": "course code exists"});
      }
      else return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    }
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
    if(err){
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    } else if(data.len == 0){
      return res.status(404).send({"success":false, "error":err.name, "message": err.message});
    } else return res.send({"success":true, "data" : data});
  })
}) 

app.get('/courseinfo/:course_id', (req,res) => {
  const query = `SELECT * FROM course WHERE _id='${req.params.course_id}';`;
  db.query(query, (err, data) => {
    if(err){
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    } else if(data.len == 0){
      return res.status(404).send({"success":false, "error":err.name, "message": err.message});
    } else return res.send({"success":true, "data" : data});
  })
}) 

app.get('/coursebyteacher/:teacher_id', (req,res) => {
  const query = `SELECT * FROM course WHERE teacher_id=${req.params.teacher_id};`;
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

//remove student from course
app.post('/remove_from_course', (req, res) => {
  const query = `
  DELETE FROM records WHERE student_id='${req.body.student_id}' AND course_id='${req.body.course_id}';
  DELETE FROM submissions WHERE student_id='${req.body.student_id}' AND assignment_id IN (SELECT _id from assignment WHERE course_id='${req.params.course_id}');
  CALL UpdateStudentCount('${req.body.course_id}');
  `;
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
                 VALUES(${req.body.student_id}, ${req.body.course_id});
                 CALL UpdateStudentCount('${req.body.course_id}');`;
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

app.get('/getstudentcount/:course_id', (req,res) => {
  const query = `SELECT COUNT(student_id) AS count FROM records WHERE course_id=${req.params.course_id};`;
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
  const query = `INSERT INTO assignment(course_id, title, description, due_date, max_marks, is_assignment)\
                 VALUES(${req.body.course_id}, '${req.body.title}', '${req.body.description}', '${req.body.due_date}', ${req.body.max_marks}, ${req.body.is_assignment});`;
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


app.get('/getattachedfile/:attachment_id', (req,res) => {
  //res.sendFile(path.join(__dirname, 'uploads', 'test.txt'))
  const query = `SELECT * FROM attachments WHERE _id=${req.params.attachment_id};`;
  
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    res.download(__dirname + '/attachemnts/'+data[0].filename);
    //return res.send({"success":true, "data" : data});
  })
  //res.download(__dirname + '/uploads/'+req.params.filename);
})

app.post('/attachments/:assignment_id',upload.single('train'), (req, res) => {
  if(!req.files){
    res.send({
        status: false,
        message: 'No file uploaded'
    });
  }
  const filename = Date.now().toString() + req.files.train.name;
  const file = req.files.train;
  console.log(filename);
  console.log(file.encoding);
  console.log(JSON.stringify(req.body));
  file.mv('attachments/'+filename, (err) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    
    const query = `INSERT INTO attachments(filename, assignment_id)\
                   VALUES('${filename}', ${req.params.assignment_id});`;
    //console.log("Quer");
    console.log(query);
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
    /*
    fs.readFile(__dirname + '/uploads/' + filename, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      
      //console.log(data);
      const query = `INSERT INTO attachments(data, assignment_id, name, description)\
                     VALUES(${data}, 1, 'file1', 'file1');`;
      //console.log("Quer");
      //console.log(query);
      db.query(query, (err, data) => {
        if(err)
          return res.status(400).send({"success":false, "error":err.name, "message": err.message});
        return res.send({"success":true, "data" : data});
      })
    })
     */
  })
  

  //console.log(file)
  //console.log(req.files)
  /*
  const f1 = new Blob(file.data);
  const query = `INSERT INTO attachments(data, assignment_id, name, description)\
                 VALUES(${f1}, 1, 'file1', 'file1');`;
  console.log(query);
  console.log(typeof(file));
  console.log(typeof(file.data));
  console.log(req.body);
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
   */
})

app.get('/attachmentsfile/:assignment_id', (req, res) => {
  const query = `SELECT * from attachments WHERE assignment_id=${req.params.assignment_id};`
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    //return res.sendFile(data[0].data);
    const path = __dirname + '/attachments/'+data[0].filename;
    console.log(path);
    res.download(path);
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


app.post('/submissions/:assignment_id/:student_id',upload.single('train'), (req, res) => {
  if(!req.files){
    res.send({
        status: false,
        message: 'No file uploaded'
    });
  }
  const filename = Date.now().toString() + req.files.train.name;
  const file = req.files.train;
  console.log(filename);
  console.log(file.encoding);
  console.log(JSON.stringify(req.body));
  console.log(req.student_id);
  file.mv('submissions/'+filename, (err) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    
    const query = `INSERT INTO submissions(filename, assignment_id, student_id)\
                   VALUES('${filename}', ${req.params.assignment_id}, ${req.params.student_id});`;
    //console.log("Quer");
    console.log(query);
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
})

app.get('/hassubmittedfile/:assignment_id/:student_id', (req,res) => {
  //res.sendFile(path.join(__dirname, 'uploads', 'test.txt'))
  const query = `SELECT * FROM submissions WHERE assignment_id=${req.params.assignment_id} AND student_id=${req.params.student_id};`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});

    const pathh = __dirname + '/submissions/'+data[0].filename;
    if(!data || !data[0] || !data[0].filename || !fs.existsSync(pathh))
      return res.status(200).send({"success":true, "file_exists": false});
    return res.status(200).send({"success":true, "file_exists": true});
    //return res.send({"success":true, "data" : data});
  })
  //res.download(__dirname + '/uploads/'+req.params.filename);
})

app.get('/getsubmittedfile/:assignment_id/:student_id', (req,res) => {
  //res.sendFile(path.join(__dirname, 'uploads', 'test.txt'))
  const query = `SELECT * FROM submissions WHERE assignment_id=${req.params.assignment_id} AND student_id=${req.params.student_id};`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    res.download(__dirname + '/submissions/'+data[0].filename);
    //return res.send({"success":true, "data" : data});
  })
  //res.download(__dirname + '/uploads/'+req.params.filename);
})
/*
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
 */
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

app.post('/gradesubmission/:assignment_id/:student_id', (req,res) => {
  console.log("marks : ",req.body.marks);
  const query = `UPDATE submissions SET marks_obtained=${req.body.marks} WHERE assignment_id=${req.params.assignment_id} AND student_id=${req.params.student_id};`;
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

app.get('/giveLastAss', (req,res) => {
  const query = `SELECT * FROM assignment ORDER BY _id DESC LIMIT 1`;
  db.query(query, (err, data) => {
    if(err)
      return res.status(400).send({"success":false, "error":err.name, "message": err.message});
    return res.send({"success":true, "data" : data});
  })
})


app.listen(PORT, () => {
  console.log(`APP is now running on port ${PORT}!`);
})
