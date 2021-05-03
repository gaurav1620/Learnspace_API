module.exports = (app, db, upload, fs) => {
  app.get('/assignmentbyid/:id', (req,res) => {
    const query = `SELECT * FROM assignment WHERE _id=${req.params.id}`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
