module.exports = (app) => {
  app.get('/get_report/:assignment_id', (req, res)=>{
    const query =`CALL send_report('${req.param.assignment_id}')`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
