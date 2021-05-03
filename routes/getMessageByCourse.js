module.exports = (app, db, upload, fs) => {
  app.get('/messagesfromcourse/:course_id', (req, res) => {
    let query = `SELECT * FROM message WHERE course_id = ${req.params.course_id} ;`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
