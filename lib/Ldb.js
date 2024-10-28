const mysql = require('mysql');
const Ldb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dockerProject'
})

Ldb.connect();
console.log('LDB loaded');


module.exports = Ldb;