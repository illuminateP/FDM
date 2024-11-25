let db = require('./db');
let sanitizehtml = require('sanitize-html');
const path = require('path');

function authIsOwner(req, res) {
    let name = 'Guest';
    let login = false;
    let cls = 'NON';
    if (req.session.is_logined) {
        name = req.session.name;
        login = true;
        cls = req.session.cls;
    }
    return { name, login, cls }
}

module.exports = {
    view: (req, res) => {
        console.log('board.view_3');
        let { name, login, cls } = authIsOwner(req, res);
        let sanitized_type_id = 3; // 고정된 게시판 타입 ID
        let pNum = req.query.pNum || 1; // 페이지 번호, 기본값은 1

        let sqlCount = `SELECT COUNT(*) AS total FROM board WHERE type_id = ?`;

        db.query(sqlCount, [sanitized_type_id], (error, countResults) => {
            if (error) {
                console.log(error);
                res.status(500).send('Internal Server Error');
                return;
            }

            let numPerPage = 10; // 페이지당 표시할 게시글 수
            let offs = (pNum - 1) * numPerPage;
            let totalPages = Math.ceil(countResults[0].total / numPerPage);

            db.query(`SELECT b.board_id, b.title, b.date, p.name 
                      FROM board b 
                      INNER JOIN person p ON b.loginid = p.loginid
                      WHERE b.type_id = ? AND b.p_id = 0 
                      ORDER BY date DESC, board_id DESC 
                      LIMIT ? OFFSET ?`,
                [sanitized_type_id, numPerPage, offs], (err, boards) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }

                    if (boards == undefined) {
                        boards = []; // 빈 배열의 길이를 읽는 경우를 방지
                    }

                    let responseData = {
                        boards: boards || [], // 조회된 게시글 목록
                        totalPages: totalPages, // 전체 페이지 수
                        pNum: pNum, // 현재 페이지 번호
                        cls: cls
                    };
                    console.log(responseData);
                    res.json(responseData);
                });
        });
    },
    detail: (req, res) => {
        console.log('board.detail 호출됨');

        // URL에서 게시글 ID 추출
        const boardId = req.params.boardId;

        const filePath = path.join(__dirname, '..', 'views', 'boardDetail.html');
        // boardDetail.html 파일을 클라이언트로 전송
        if (boardId == 1) {
            res.sendFile(filePath, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).send('Internal Server Error');
                }
            });
        }

        // 게시글 상세 데이터 조회 쿼리 실행
        db.query(`SELECT board_id, title, content, loginid, date, type_id FROM board WHERE board_id = ?`, [boardId], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            // 게시글이 존재하지 않는 경우
            if (result.length === 0) {
                res.status(404).send('Board not found');
                return;
            }

        });
    },

    create: (req, res) => {
        const { name, loginid, cls } = req.session; // 세션에서 사용자 정보 가져오기
        if (!name || !loginid) {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }

        res.json({
            name, // 사용자 이름
            loginid, // 로그인 ID
            type_id: 3 // 게시판의 고정된 type_id
        });
    },

    create_process: (req, res) => {
        console.log('board.create_process');

        let post = req.body;
        console.log(post);

        let sanitized_type_id = 3; // 고정된 type_id
        let sanitized_login_id = sanitizehtml(post.loginid);
        let sanitized_password = sanitizehtml(post.password);
        let sanitized_title = sanitizehtml(post.title);
        let sanitized_content = sanitizehtml(post.content);

        db.query(`INSERT INTO board (type_id, loginid, password, title, date, content) VALUES (?, ?, ?, ?, NOW(), ?)`,
            [
                sanitized_type_id,
                sanitized_login_id,
                sanitized_password,
                sanitized_title,
                sanitized_content
            ], (err, result) => {

                console.log(result);
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.redirect(`/api/board/view`);
            });
    },

    delete_process: (req, res) => {
        console.log('board.delete_process');

        let sanitized_board_id = sanitizehtml(req.params.boardId);
        let sanitized_type_id = 3; // 고정된 type_id
        let sanitized_pNum = sanitizehtml(req.params.pNum);

        db.query(`SELECT * FROM board WHERE board_id = ?`, [sanitized_board_id], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            let pw = results[0].password;
            let { login, name, cls } = authIsOwner(req, res);

            if (cls == 'MNG' || name == results[0].loginid) {
                db.query(`DELETE FROM board WHERE board_id = ?;`, [sanitized_board_id], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
                    res.writeHead(302, { location: `/board/view/${sanitized_type_id}/${sanitized_pNum}` });
                    res.end();
                });
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <script language="JavaScript" type="text/javascript">
                        alert("비밀번호가 일치하지 않습니다.");
                        setTimeout(() => {
                            location.href = 'http://localhost:3000/board/view/${sanitized_type_id}/${sanitized_pNum}';
                        }, 1000);
                    </script>`);
            }
        });
    }
};
