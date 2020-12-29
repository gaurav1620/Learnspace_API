module.exports = (app, db) => {
  app.get('/course/:course_code', (req,res) => {
    const query = `SELECT * FROM course WHERE course_code='${req.params.course_code}';`;
    db.query(query, (err, data) => {
      if(err){
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      } else if(data.len == 0){
        return res.status(404).send({"success":false, "error":err.name, "message": err.message});
      } else return res.send({"success":true, "data" : data});
    })
  }) 
}
