module.exports = (app) => {
  app.post('/remove_from_course', (req, res) => {
    const query = `
    DELETE FROM records WHERE student_id='${req.body.student_id}' AND course_id='${req.body.course_id}';
    DELETE FROM submissions WHERE student_id='${req.body.student_id}' AND assignment_id IN (SELECT _id from assignment WHERE course_id='${req.params.course_id}');
    CALL UpdateStudentCount('${req.body.course_id}');
    `;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
