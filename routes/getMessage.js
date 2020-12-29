module.exports = (app, db) => {
  app.get('/message', (req, res) => {
    let query = `SELECT * FROM message ;`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
