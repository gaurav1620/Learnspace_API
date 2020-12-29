module.exports = (app, db) => {
  app.post('/startquiz/:id', (req,res) => {
    const query = `UPDATE quiz SET is_active = TRUE WHERE _id = ${req.params.id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
