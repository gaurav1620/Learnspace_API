module.exports = (app, db, upload, fs) => {
  app.post('/gradesubmission/:assignment_id/:student_id', (req,res) => {
    console.log("marks : ",req.body.marks);
    const query = `UPDATE submissions SET marks_obtained=${req.body.marks} WHERE assignment_id=${req.params.assignment_id} AND student_id=${req.params.student_id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
