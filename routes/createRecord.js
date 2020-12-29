module.exports = (app, db) => {
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

}
