module.exports = (app, db, upload, fs) => {
  app.get('/teacher/:id', (req, res) => {
    const query = `SELECT * FROM teacher WHERE _id=${req.params.id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
