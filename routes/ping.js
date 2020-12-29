module.exports = (app, db) => {
  app.get('/ping', (req, res) => {
    res.send({'ping':'pong'});
  });
}
