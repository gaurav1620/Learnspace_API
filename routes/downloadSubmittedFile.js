module.exports = (app, db) => {
  app.get('/submissionsfile/:assignment_id/:student_id', (req, res) => {
    const query = `SELECT * from submissions WHERE assignment_id='${req.params.assignment_id}' AND student_id=${req.params.student_id};`
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.sendFile(data[0].data);
    })
  })
}
