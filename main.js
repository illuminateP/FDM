const express = require('express');

const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const bodyparser = require('body-parser');

const db = require('./lib/db');
const authorRouter = require('./router/authorRouter');
const rootRouter = require('./router/rootRouter');

// 세션 DB 정의
const options = {
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'dockerProject'
};

const sessionStore = new MysqlStore(options);

const app = express();

app.use(session({
    secret : 'Fine Data Mine VeRsIoN0.0',
    resave : false,
    saveUninitialized : true,
    store : sessionStore
}));

app.use(bodyparser.urlencoded({ extended: false })); // URL-encoded 데이터 처리
app.use(bodyparser.json()); // JSON 데이터 처리

app.set('views',__dirname+'/views');
app.set('view engine','ejs');

app.use('/', rootRouter);
app.use('/author',authorRouter);
app.use(express.static('public'));

app.get('/favicon.ico', (req, res) => res.writeHead(404));
app.listen(3000, () => console.log('http://127.0.0.1:3000/!'));
