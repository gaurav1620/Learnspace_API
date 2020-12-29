module.exports = (app, db) => {
  app.post('/message', (req,res) => {
    const query = `INSERT INTO message (user_id,user_name, user_type, message_content, time_stamp,course_id) \
                    VALUES (${req.body.user_id}, '${req.body.user_name}', '${req.body.user_type}', '${req.body.message_content}', '${req.body.time_stamp}', ${req.body.course_id})`
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
