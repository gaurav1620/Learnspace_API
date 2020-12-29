module.exports = (app, db, upload) => {
  app.post('/submissions/:assignment_id/:student_id',upload.single('train'), (req, res) => {
    if(!req.files){
      res.send({
          status: false,
          message: 'No file uploaded'
      });
    }
    const filename = Date.now().toString() + req.files.train.name;
    const file = req.files.train;
    console.log(filename);
    console.log(file.encoding);
    console.log(JSON.stringify(req.body));
    console.log(req.student_id);
    file.mv('submissions/'+filename, (err) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      
      const query = `INSERT INTO submissions(filename, assignment_id, student_id)\
                     VALUES('${filename}', ${req.params.assignment_id}, ${req.params.student_id});`;
      //console.log("Quer");
      console.log(query);
      db.query(query, (err, data) => {
        if(err)
          return res.status(400).send({"success":false, "error":err.name, "message": err.message});
        return res.send({"success":true, "data" : data});
      })
    })
  })
}
