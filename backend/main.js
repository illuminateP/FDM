const express = require('express');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const bodyparser = require('body-parser');

const authRouter = require('./router/authRouter');
const rootRouter = require('./router/rootRouter');
const boardRouter = require('./router/boardRouter');

// 세션 DB 정의
const options = {
    host: process.env.DB_HOST || 'mysql-container', 
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'dockerProject',
    createDatabaseTable: true,
    charset: 'utf8mb4'  // 문자셋 추가
};

const sessionStore = new MysqlStore(options);

const app = express();

app.use(session({
    secret: 'Fine Data Mine VeRsIoN0.0',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
}));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// 정적 파일 제공
app.use(express.static('public'));

// 라우터 등록
app.use('/api/', rootRouter);
app.use('/api/auth', authRouter); 
app.use('/api/board', boardRouter);

// 한글 헤더 사용
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

app.get('/favicon.ico', (req, res) => res.writeHead(404));

app.listen(3000, () => console.log('http://127.0.0.1:3000/!'));
