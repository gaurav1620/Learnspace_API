module.exports = (app, db, upload, fs) => {
  app.get('/quizresult/:quiz_id', (req, res) => {
    let query = `SELECT * FROM quiz_submission WHERE quiz_id = ${req.params.quiz_id} ;`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
