module.exports = (app) => {
  app.post('/course_check', (req, res) => {
    const query = `SELECT * FROM course WHERE course_code='${req.body.course_code}';`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
