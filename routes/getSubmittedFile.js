module.exports = (app) => {
  app.get('/getsubmittedfile/:assignment_id/:student_id', (req,res) => {
    //res.sendFile(path.join(__dirname, 'uploads', 'test.txt'))
    const query = `SELECT * FROM submissions WHERE assignment_id=${req.params.assignment_id} AND student_id=${req.params.student_id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      res.download(__dirname + '/submissions/'+data[0].filename);
      //return res.send({"success":true, "data" : data});
    })
    //res.download(__dirname + '/uploads/'+req.params.filename);
  })
}
