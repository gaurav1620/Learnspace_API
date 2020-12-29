module.exports = (app, db) => {
  app.get('/quizfromcourse/:id', (req, res) => {
    console.log('id is ', req.params.id)
    let query = `SELECT * FROM quiz WHERE course_id = ${req.params.id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })

}
