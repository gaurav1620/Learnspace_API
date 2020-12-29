module.exports = (app) => {
  app.post('/question', (req,res) => {
    console.log(req.body)
    let q = req.body
    let query = ''
    let keywords = req.body.keywords ? req.body.keywords.join('.') : null
    if(q.questionType === 'mcq') {
      query = `INSERT INTO question (quiz_id,question_title, question_type,option_1, option_2, option_3, option_4, correct_option, textual_ques_marks, min_char,QID, keywords)\
                   VALUES(${q.quizID}, '${q.questionTitle}', '${q.questionType}', '${q.option1}',  '${q.option2}',  '${q.option3}',  '${q.option4}',  ${q.correctOption},  null,  null,  ${q.QID}, null);`;
    } else {
      query = `INSERT INTO question (quiz_id,question_title, question_type,option_1, option_2, option_3, option_4, correct_option, textual_ques_marks, min_char,QID, keywords)\
      VALUES(${q.quizID}, '${q.questionTitle}', '${q.questionType}', null,  null,  null,  null,  null,  ${q.textualQuesMarks},  ${q.minChar},  ${q.QID}, '${keywords}');`;
    }
    
    
    console.log('query is ', query)
    db.query(query, (err, data) => {
      if(err)
        return res.status(400).send({"success":false, "error":err.name, "message": err.message});
      return res.send({"success":true, "data" : data});
    })
  })
}
