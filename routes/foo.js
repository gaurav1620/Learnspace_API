module.exports = (app, db) => {
  app.get('/foo', (req, res) => {
    res.send({'foo':'bar'});
  });
}
