module.exports = (app) => {
  app.get('/courseinfo/:course_id', (req,res) => {
    const query = `SELECT * FROM course WHERE _id='${req.params.course_id}';`;
    db.query(query, (err, data) => {
      if(err){
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      } else if(data.len == 0){
        return res.status(404).send({"success":false, "error":err.name, "message": err.message});
      } else return res.send({"success":true, "data" : data});
    })
  }) 
}
