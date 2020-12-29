module.exports = (app, db) => {
  app.post('/updateteachername', (req, res) => {
    console.log(req.body);
    const query = `UPDATE teacher SET fname='${req.body.fname}', lname='${req.body.lname}' WHERE email='${req.body.email}';`
    console.log(query);
    db.query(query, (err, data) => {
      if(err){
        if(err.message.includes('ER_DUP_ENTRY')){
          return res.send({"success":false, "reason": "Email exists"});
        }
        else return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      }
      return res.send({"success":true, "data" : data});
    })
  })

}
