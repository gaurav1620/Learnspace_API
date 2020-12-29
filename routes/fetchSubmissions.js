module.exports  = (app, db) => {
  app.get('/submissions', (req, res) => {
    const query = `SELECT * FROM submissions;`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
