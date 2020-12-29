module.exports = (app, db) => {
  app.get('/coursesenrolled/:student_id', (req,res) => {
    const query = `SELECT * from course WHERE _id IN(SELECT course_id FROM records WHERE student_id=${req.params.student_id});`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
