module.exports = (app, db, upload, fs) => {
    app.get('/notes', (req, res) => {
      const query = `SELECT * FROM notes;`;
      db.query(query, (err, data) => {
        if(err)
          return res.status(400).send({"success":false, "error":err.name, "message": err.message});
        return res.send({"success":true, "data" : data});
      })
    })
  }
