module.exports = function(app, db){
    app.get('/ping_student', (req, res) => {
        res.send('works')
    })

    //get all students
    app.get('/student', (req, res) => {
        const query = `SELECT * FROM student;`;
        db.query(query, (err, data) => {
          if(err)
            return res.status(400).send({"success":false, "error":err.name, "message": err.message});
          return res.send({"success":true, "data" : data});
        })
      })

      //create new students
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

      //get a student by _id
      app.get('/student/:id', (req, res) => {
        const query = `SELECT * FROM student WHERE _id=${req.params.id};`;
        db.query(query, (err, data) => {
          if(err)
            return res.status(400).send({"success":false, "error":err.name, "message": err.message});
          return res.send({"success":true, "data" : data});
        })
      })

      //checks if student email and password exists during login
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

      //update students name
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
}