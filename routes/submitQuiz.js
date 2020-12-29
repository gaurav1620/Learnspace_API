module.exports = (app) => {
  app.post('/submitquiz', (req,res) => {
    const query = `INSERT INTO quiz_submission (quiz_id, student_id,total_marks, marks_obtained, ques_attempted, student_name, no_of_ques) \
                    VALUES (${req.body.quiz_id}, ${req.body.student_id}, ${req.body.totalMarks}, ${req.body.marksObtained}, ${req.body.questionsAttempted}, '${req.body.studentName}', ${req.body.numberOfQuestions})`
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })

}
