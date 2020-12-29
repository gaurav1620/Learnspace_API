module.exports = (app, db) => {
  app.get('/coursebyteacher/:teacher_id', (req,res) => {
    const query = `SELECT * FROM course WHERE teacher_id=${req.params.teacher_id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  }) 
}
