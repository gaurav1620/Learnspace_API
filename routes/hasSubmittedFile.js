module.exports = (app, db) => {
  app.get('/hassubmittedfile/:assignment_id/:student_id', (req,res) => {
    //res.sendFile(path.join(__dirname, 'uploads', 'test.txt'))
    const query = `SELECT * FROM submissions WHERE assignment_id=${req.params.assignment_id} AND student_id=${req.params.student_id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});

      if(!data || !data[0] || !data[0].filename)
        return res.status(200).send({"success":true, "file_exists": false});
      const pathh = __dirname + '/submissions/'+data[0].filename;
      if(!fs.existsSync(pathh))
        return res.status(200).send({"success":true, "file_exists": false});
      return res.status(200).send({"success":true, "file_exists": true});
      //return res.send({"success":true, "data" : data});
    })
    //res.download(__dirname + '/uploads/'+req.params.filename);
  })
}
