const db = require('./db');
const Ldb = require('./Ldb');

const sani = require('sanitize-html');


authIsOwner = (req, res) => {
    if (req.session.is_logined) {
        return true;
    }
    else {
        return false;
    }

};

authStatusUI = (req, res) => {
    let login = `<a href='/login'>login</a>`;
    if (authIsOwner(req, res)) {
        login = `<a href='/logout_process'>logout</a>`
    }
    return login;
}


module.exports = {

    login_page: (req, res) => {
        res.render('loginPage', (err, html) => {
            if (err) {
                console.log(err);
            }
            res.end(html);
        });
    },

    login_process: (req, res) => {
        let post = req.body;
        const username = sani(post.username);
        const password = sani(post.password);

        console.log('username : ' + username);

        Ldb.query('select * From users WHERE username = ? AND password = ?', [username, password], (err, results) => {
            if (!err) {
                if (results.length > 0) {
                    req.session.is_logined = true
                    req.session.username = results[0].username;
                    req.session.sid = results[0].sid;
                    console.log(req.session.username);
                    res.redirect('/home');
                }
                else {
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`<script type='text/javascript'>alert('로그인 실패!')
                        setTimeout("location.href = '/'",1000);
                        </script>`);
                }

            }
            else {
                console.log('something went wrong at login_process : ' + err);
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<script>alert("something went wrong at login_process"); history.back();</script>');
            }
        });

    },

    login_process_proxy: (req, res) => {
        req.session.is_logined = false;
        req.session.username = 'proxyUser';
        req.session.sid = '88848';
        res.redirect('/home');
    },

    logout_process: (req, res) => {
        console.log('logout_process');
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/');
        });

    },

    register: (req, res) => {
        res.render('registerPage.ejs', (err, html) => {
            if (err) {
                console.log(err);
            }
            res.end(html);
        });

    },

    register_process: (req, res) => {

        function generateUniqueSID() {
            return Math.floor(10000 + Math.random() * 90000); // 10000부터 99999 사이의 숫자
        }

        let post = req.body;
        console.log(post);

        const username = sani(post.username);
        const password = sani(post.password);
        const email = sani(post.email);
        const token = 0;


        let sid;

        // sid 조회
        const checkSIDExists = (sid) => {
            return new Promise((resolve, reject) => {
                db.query('SELECT COUNT(*) AS count FROM users WHERE sid = ?', [sid], (err, results) => {
                    if (err) {
                        return reject(err); // 에러 발생 시 reject
                    }
                    // 결과가 없을 경우 count가 0으로 설정되도록 수정
                    const count = results[0] ? results[0].count : 0;
                    resolve(count > 0);
                });
            });
        };

        // SID 생성 및 사용자 정보 DB에 삽입
        const registerUser = async () => {
            do {
                sid = generateUniqueSID();
            } while (await checkSIDExists(sid));

            // 사용자 정보 DB에 삽입
            db.query('INSERT INTO users (username, password, email, sid, token) VALUES (?, ?, ?, ?, ?)',
                [username, password, email, sid, token], (err) => {
                    if (err) {
                        console.log('something went wrong at register_process: ' + err);
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end('<script>alert("something went wrong at register_process"); history.back();</script>');
                    } else {
                        res.writeHead(302, { Location: '/' }); // 회원가입 성공 후 로그인 페이지로 리다이렉트
                        res.end();
                    }
                });
        };

        // 사용자 등록 호출
        registerUser().catch(err => {
            console.error('Error during user registration:', err);
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<script>alert("서버 오류 발생"); history.back();</script>');
        });
    },


    findPassword: (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<script type='text/javascript'>alert('추가 예정!')
            setTimeout("location.href = '/'",1000);
            </script>`);
        // alert 창으로 '추가예정'을 띄우고 1초 후 홈으로 redirect
        console.log('추가 예정!');
    },

    home: (req, res) => {
        let login = authStatusUI(req, res)
        sanitized_username = sani(req.session.username);
        let user = sani(sanitized_username);

        let context = {
            user: user,
            login: login
        };

        console.log('/home');

        res.render('home', context, (err, html) => {
            if (err) {
                console.log(err);
            }
            res.end(html);
        })
    }
    /* 갖다 쓰려고
    create: (req, res) => {
        var login = '';
        login = authStatusUI(req, res);

        if (authIsOwner(req, res) == false) {
            res.end(`<script type="text/javascript">alert("Login required ~~~")
                        setTimeout("location.href = 'http://localhost:3000/'",1000);
          </script>`)
            return; // 인증 실패 이후 추가적인 코드 실행을 막는다.
        }
        db.query(`select * from topic`, (err, topics) => {
            if (err) {
                throw err;
            }
            db.query(`SELECT * FROM author`, (err, authors) => {
                var i = 0;
                var tag = '';
                while (i < authors.length) {
                    tag += `<option value ="${authors[i].id}">${authors[i].name}</option>`
                    i++;
                }

                var m = `<a href ="create">create</a>`;
                var b = `<form action = '/create_p' method = 'post'>
                <p><input type = 'text' name = 'title' placeholder = 'title_create'></p>
                <p><textarea name = 'description' placeholder = 'description_create'></textarea></p>
                <p><select name = 'author'>
                ${tag}
                </select></p>
                <p><input type = 'submit'></p>
            </form>`;
                var t = `TOPIC 자료 생성 화면`

                var context = {
                    login: login,
                    list: topics,
                    menu: m,
                    body: b,
                    title: t
                };

                res.render('home05', context, (err, html) => {
                    if (err) {
                        console.log(err);
                    }
                    res.end(html);
                });
            });
        });
    },
    */
}  
