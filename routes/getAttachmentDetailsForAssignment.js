module.exports = (app, db) => {
  app.get('/attachments/:assignment_id', (req,res) => {
    const query = `SELECT * FROM attachments WHERE assignment_id=${req.params.assignment_id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  }) 
}
