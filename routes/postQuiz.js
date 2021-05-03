module.exports = (app, db, upload, fs) => {
  app.post('/quiz', (req,res) => {
    const query = `INSERT INTO quiz (number_of_questions, total_marks, is_active, teacher_id, course_id, quiz_title)\
                    VALUES (${req.body.numberOfQuestions}, ${req.body.totalMarks}, ${req.body.isActive}, ${req.body.teacher_id}, ${req.body.course_id}, '${req.body.quizTitle}');`;
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
