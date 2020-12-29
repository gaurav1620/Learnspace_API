module.exports = (app) => {
  app.get('/getattachedfile/:assignment_id', (req,res) => {
    //res.sendFile(path.join(__dirname, 'uploads', 'test.txt'))
    const query = `SELECT * FROM attachments WHERE assignment_id=${req.params.assignment_id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      if(!data || !data[0] || !data[0].filename || !fs.existsSync(__dirname+'/attachments/'+data[0].filename))
        return res.status(400).send({"success":false, "message": "file not found"});
      res.download(__dirname + '/attachments/'+data[0].filename);
      //return res.send({"success":true, "data" : data});
    })
    //res.download(__dirname + '/uploads/'+req.params.filename);
  })
}
