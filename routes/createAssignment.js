module.exports = (app, db) => {
  app.post('/assignment', (req, res) => {
    const query = `INSERT INTO assignment(course_id, title, description, due_date, max_marks, is_assignment)\
                   VALUES(${req.body.course_id}, '${req.body.title}', '${req.body.description}', '${req.body.due_date}', ${req.body.max_marks}, ${req.body.is_assignment});`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
