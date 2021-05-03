module.exports = (app, db, upload, fs) => {
  app.get('/assignment', (req,res) => {
    const query = `SELECT * FROM assignment;`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
