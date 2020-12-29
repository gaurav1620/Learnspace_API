module.exports = (app, db) => {
  app.post('/changeassignmentname/:id', (req, res) => {
    const query = `UPDATE assignment SET title=${req.body.title}, description=${req.body.description} WHERE _id=${req.params.id}`
    db.query(query, (err, data) => {
      if(err){    
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      }
      return res.send({"success":true, "data" : data});
    })
  })

  app.post('/changecoursename/:id', (req, res) => {
    const query = `UPDATE course SET name=${req.body.name}, description=${req.body.description} WHERE _id=${req.params.id}`
    db.query(query, (err, data) => {
      if(err){    
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      }
      return res.send({"success":true, "data" : data});
    })
  })
}
