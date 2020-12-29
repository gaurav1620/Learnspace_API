module.exports = (app, db) => {
  app.get('/notes/:user_type/:id', (req,res) => {
    const query = `SELECT * FROM notes WHERE user_id=${req.params.id} and user_type='${req.params.user_type}';`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  }) 
}
