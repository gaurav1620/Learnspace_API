require('./../db');

module.exports = function(app, db){
    app.get('/hello', (req, res) => {
        res.send('bye')
    })

    app.get('/student', (req, res) => {
        const query = `SELECT * FROM student;`;
        db.query(query, (err, data) => {
          if(err)
            return res.status(400).send({"success":false, "error":err.name, "message": err.message});
          return res.send({"success":true, "data" : data});
        })
      })
}