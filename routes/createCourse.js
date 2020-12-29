module.exports = (app, db) => {
  app.post('/course', (req, res) => {
    const query = `INSERT INTO course(teacher_id, name, description, year, department, course_code)\
                   VALUES(${req.body.teacher_id}, '${req.body.name}', '${req.body.description}', '${req.body.year}', '${req.body.department}', '${req.body.course_code}');`;
    db.query(query, (err, data) => {
      if(err){
        if(err.message.includes('ER_DUP_ENTRY')){
          return res.send({"success":false, "reason": "course code exists"});
        }
        else return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      }
      return res.send({"success":true, "data" : data});
    })
  })
}
