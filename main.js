const express = require('express');

var session = require('express-session');
var MysqlStore = require('express-mysql-session')(session);
var bodyparser = require('body-parser');

var db = require('./lib/db');
var authorRouter = require('./router/authorRouter');
var rootRouter = require('./router/rootRouter');

var options = {
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'webdb2024'
}

var sessionStore = new MysqlStore(options);

const app = express();

app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true,
    store : sessionStore
}));

app.use(bodyparser.urlencoded({extended:false}));

app.set('views',__dirname+'/views');
app.set('view engine','ejs');

app.use('/', rootRouter);
app.use('/author',authorRouter);
app.use(express.static('public'));

app.get('/favicon.ico', (req, res) => res.writeHead(404));
app.listen(3000, () => console.log('http://127.0.0.1:3000/!'));
