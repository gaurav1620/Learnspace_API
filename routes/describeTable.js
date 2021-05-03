module.exports = (app, db, upload, fs) => {
  app.get('/describe/:tablename', (req, res)=>{
    const query = `DESCRIBE ${req.params.tablename};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
