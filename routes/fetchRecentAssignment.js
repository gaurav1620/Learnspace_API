module.exports = (app, db) => {
  app.get('/giveLastAss', (req,res) => {
    const query = `SELECT * FROM assignment ORDER BY _id DESC LIMIT 1`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
