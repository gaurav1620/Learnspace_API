module.exports = (app, db, upload, fs) => {
  app.post('/deletecourse', (req, res) => {
    const course_code = req.body.course_code;
    const course_id = req.body.course_id;

    const query = `
    DELETE FROM submissions WHERE assignment_id IN (SELECT _id FROM assignment WHERE course_id=${course_id});
    DELETE FROM attachments WHERE assignment_id IN (SELECT _id FROM assignment WHERE course_id=${course_id});
    DELETE FROM assignment WHERE course_id=${course_id};
    DELETE FROM records WHERE course_id=${course_id};
    DELETE FROM course WHERE course_code='${course_code}';
    `;
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
