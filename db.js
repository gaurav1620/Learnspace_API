'user strict';

var mysql = require('mysql-ssh');

var connection = mysql.connect(
    {
        host: 'ec2-3-82-248-102.compute-1.amazonaws.com',
        port: 69,
        user: 'rterror',
        password: 'runtimeterror'
    },
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'RuntimeTerror@123',
        database: 'testone'
    }
).then(client => {
    client.query('SELECT * FROM student', function (err, results, fields) {
        if (err) throw err
        console.log(results);
        mysql.close()
    })
})
.catch(err => {
    console.log(err)
})

module.exports = connection;
