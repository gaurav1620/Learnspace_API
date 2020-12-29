module.exports = (app, db) => {
  app.post('/teacher_login', (req, res) => {
    const query = `SELECT * FROM teacher WHERE email = '${req.body.email}' AND password = '${req.body.password}';`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      if(data == '')
        return res.send({"teacher": "not found"});
      return res.send({"teacher": "found", "data": data});
    })
  })
}
