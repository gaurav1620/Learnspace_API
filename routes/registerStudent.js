module.exports = (app, db) => {
  app.post('/student', (req, res) => {
    console.log(req.body);
    const query = `INSERT INTO student(fname, lname, email, password, year, department) VALUES('${req.body.fname}', '${req.body.lname}', '${req.body.email}', '${req.body.password}', '${req.body.year}', '${req.body.department}');`;
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
