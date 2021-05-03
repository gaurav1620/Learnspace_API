module.exports = (app, db, upload, fs) => {
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
}
