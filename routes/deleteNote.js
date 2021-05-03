module.exports = (app, db, upload, fs) => {
  app.delete('/notes/:_id', (req, res) => {
    const query = `DELETE FROM notes WHERE _id=${req.params._id};`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
