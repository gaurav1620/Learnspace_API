module.exports = (app, db, upload, fs) => {
  app.get('/foo', (req, res) => {
    res.send({'foo':'bar'});
  });
}
