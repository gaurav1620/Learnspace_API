module.exports = function(app, db){
    app.get('/ping_teacher', (req, res) => {
        res.send('works')
    })

    //gets all teachers
    app.get('/teacher', (req, res) => {
        const query = 'SELECT * FROM teacher;';
        db.query(query, (err, data) => {
          if(err)
            return res.status(400).send({"success":false, "error":err.name, "message": err.message});
          return res.send({"success":true, "data" : data});
        })
      })

      //create a new teacher
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

      //get a teacher by _id
      app.get('/teacher/:id', (req, res) => {
        const query = `SELECT * FROM teacher WHERE _id=${req.params.id};`;
        db.query(query, (err, data) => {
          if(err)
            return res.status(400).send({"success":false, "error":err.name, "message": err.message});
          return res.send({"success":true, "data" : data});
        })
      })

      //checks teachers email and password during login
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

      //update teacher name
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
}