module.exports = function(app, db) {
    app.get('/ping_courses', (req, res) => {
        res.send('works')
    })

    //get all courses
    app.get('/course', (req,res) => {
        const query = `SELECT * FROM course;`;
        db.query(query, (err, data) => {
          if(err)
            return res.status(400).send({"success":false, "error":err.name, "message": err.message});
          return res.send({"success":true, "data" : data});
        })
      }) 

    //create a new course
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

      //delete course
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

      //get course from course code
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

      //get course from course id
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

      //get all courses of a teacher by teacher id
      app.get('/coursebyteacher/:teacher_id', (req,res) => {
        const query = `SELECT * FROM course WHERE teacher_id=${req.params.teacher_id};`;
        db.query(query, (err, data) => {
          if(err)
            return res.status(400).send({"success":false, "error":err.name, "message": err.message});
          return res.send({"success":true, "data" : data});
        })
      })
}