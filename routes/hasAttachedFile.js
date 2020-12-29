module.exports = (app) => {
  app.get('/hasattachedfile/:assignment_id', (req,res) => {
    const query = `SELECT * FROM attachments WHERE assignment_id=${req.params.assignment_id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      if(!data || !data[0] || !data[0].filename )
        return res.status(200).send({"success":true, "file_exists": false});
      const pathh = __dirname + '/attachments/'+data[0].filename;
      if(!fs.existsSync(pathh))
        return res.status(200).send({"success":true, "file_exists": false});
      return res.status(200).send({"success":true, "file_exists": true});
      //return res.send({"success":true, "data" : data});
    })
  })
}
