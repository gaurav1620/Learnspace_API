module.exports = (app, db, upload, fs) => {
  app.get('/submissions/:assignment_id', (req,res) => {
    const query = `SELECT * FROM submissions WHERE assignment_id=${req.params.assignment_id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
