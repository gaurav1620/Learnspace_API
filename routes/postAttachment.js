module.exports = (app, db, upload, fs) => {
  app.post('/attachments/:assignment_id',upload.single('train'), (req, res) => {
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
    file.mv('attachments/'+filename, (err) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});

      const query = `INSERT INTO attachments(filename, assignment_id)\
                     VALUES('${filename}', ${req.params.assignment_id});`;
      //console.log("Quer");
      console.log(query);
      db.query(query, (err, data) => {
        if(err)
          return res.status(400).send({"success":false, "error":err.name, "message": err.message});
        return res.send({"success":true, "data" : data});
      })
      /*
      fs.readFile(__dirname + '/uploads/' + filename, (err, data) => {
        if(err)
          return res.status(400).send({"success":false, "error":err.name, "message": err.message});

        //console.log(data);
        const query = `INSERT INTO attachments(data, assignment_id, name, description)\
                       VALUES(${data}, 1, 'file1', 'file1');`;
        //console.log("Quer");
        //console.log(query);
        db.query(query, (err, data) => {
          if(err)
            return res.status(400).send({"success":false, "error":err.name, "message": err.message});
          return res.send({"success":true, "data" : data});
        })
      })
       */
    })


    //console.log(file)
    //console.log(req.files)
    /*
    const f1 = new Blob(file.data);
    const query = `INSERT INTO attachments(data, assignment_id, name, description)\
                   VALUES(${f1}, 1, 'file1', 'file1');`;
    console.log(query);
    console.log(typeof(file));
    console.log(typeof(file.data));
    console.log(req.body);
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
     */
  })

}
