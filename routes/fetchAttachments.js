module.exports = (app, db, upload, fs) => {
  app.get('/attachments', (req,res) => {
    //res.sendFile(path.join(__dirname, 'uploads', 'test.txt'))
    const query = `SELECT * FROM attachments;`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.status(200).send({"success":true, "data": data});
      //return res.send({"success":true, "data" : data});
    })
    //res.download(__dirname + '/uploads/'+req.params.filename);
  })
}
