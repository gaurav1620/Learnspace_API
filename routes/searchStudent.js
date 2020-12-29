module.exports = (app, db) => {
  app.get('/search/:course_id/:fname/:lname', (req,res) => {
    const query = `SELECT * FROM student WHERE _id IN(SELECT student_id FROM records WHERE course_id=${req.params.course_id}) AND (fname='${req.params.fname}' AND lname='${req.params.lname}');`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
