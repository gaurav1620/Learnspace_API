const studentRoutes = require('./student');
const teacherRoutes = require('./teacher');

module.exports = function(app, db) {
    studentRoutes(app, db);
    teacherRoutes(app, db);
}