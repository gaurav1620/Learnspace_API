module.exports = (app) => {
  app.get('/getstudentcount/:course_id', (req,res) => {
    const query = `SELECT COUNT(student_id) AS count FROM records WHERE course_id=${req.params.course_id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
