module.exports = (app) => {
  app.get('/assignment/:course_id', (req,res) => {
    const query = `SELECT * FROM assignment WHERE course_id=${req.params.course_id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  }) 
}
