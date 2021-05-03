module.exports = (app, db, upload, fs) => {
  app.get('/ping', (req, res) => {
    res.send({'ping':'pong'});
  });
}
