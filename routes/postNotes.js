module.exports = (app, db) => {
  app.post("/notes", (req, res) => {
    const query = `INSERT INTO notes(user_id, user_type, day, date, time, content)\
                 VALUES(${req.body.user_id}, '${req.body.user_type}', '${req.body.day}', '${req.body.date}', '${req.body.time}', '${req.body.content}');`;
    db.query(query, (err, data) => {
      if (err) {
        return res
          .status(400)
          .send({ success: false, error: err.name, message: err.message });
      }
      return res.send({ success: true, data: data });
    });
  });
};
