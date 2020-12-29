module.exports = (app, db) => {
  app.get('/attachmentsbyid/:id', (req,res) => {
    const query = `SELECT * FROM attachments WHERE _id=${req.params.id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
