module.exports = function(app, db) {
    app.get('/ping_records', (req, res) => {
        res.send('works')
    })

    //get all records ( all students enrolled in courses )
    app.get('/records', (req, res) => {
        const query = 'SELECT * FROM records;';
        db.query(query, (err, data) => {
          if(err)
            return res.status(400).send({"success":false, "error":err.name, "message": err.message});
          return res.send({"success":true, "data" : data});
        })
      })

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

      //get all students in a course
      app.get('/records/:course_id', (req,res) => {
        const query = `SELECT * FROM student WHERE _id IN(SELECT student_id FROM records WHERE course_id=${req.params.course_id});`;
        db.query(query, (err, data) => {
          if(err)
            return res.status(400).send({"success":false, "error":err.name, "message": err.message});
          return res.send({"success":true, "data" : data});
        })
      })
}