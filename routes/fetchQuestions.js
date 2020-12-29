module.exports = (app) => {
  app.get('/questions', (req, res) => {
    const query = 'SELECT * FROM question;';
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
