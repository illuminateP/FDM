const db = require('./db');
const sanitizeHtml = require('sanitize-html');

function authIsOwner(req) {
    const name = req.session?.name || 'Guest';
    const cls = req.session?.cls || 'NON';
    const isLoggedIn = req.session?.is_logined || false;

    return { name, cls, isLoggedIn };
}

module.exports = {
    // 게시판 3번의 게시글 목록 조회
    view_3: (req, res) => {
        console.log('게시판 3 조회 요청');
        const query = `
            SELECT board_id, title, content, loginid, date 
            FROM board 
            WHERE type_id = 3 
            ORDER BY date DESC
        `;

        db.query(query, (err, rows) => {
            if (err) {
                console.error('게시판 3 조회 오류:', err);
                return res.status(500).json({ success: false, message: '게시판 데이터를 불러오는 중 오류가 발생했습니다.' });
            }
            console.log(rows);

            // 쿼리 성공, 데이터 반환
            res.json({
                success: true,
                boards: rows || [],
                cls: req.session.cls || 'NON', // 사용자 권한 반환
            });
        });
    },

    // 게시글 생성
    create_process: (req, res) => {
        console.log('board.create_process');

        const { name, cls, isLoggedIn } = authIsOwner(req);
        if (!isLoggedIn || cls === 'proxy') {
            return res.status(403).json({ success: false, message: '권한이 없습니다.' });
        }

        const post = req.body;

        const sanitizedTypeId = sanitizeHtml(post.typeId);
        const sanitizedLoginId = sanitizeHtml(post.loginId);
        const sanitizedPassword = sanitizeHtml(post.password);
        const sanitizedTitle = sanitizeHtml(post.title);
        const sanitizedContent = sanitizeHtml(post.content);

        db.query(
            `INSERT INTO board (type_id, loginid, password, title, date, content) VALUES (?, ?, ?, ?, NOW(), ?)`,
            [
                sanitizedTypeId,
                sanitizedLoginId,
                sanitizedPassword,
                sanitizedTitle,
                sanitizedContent
            ],
            (err) => {
                if (err) {
                    console.error('게시글 생성 오류:', err);
                    return res.status(500).json({ success: false, message: '게시글 생성 중 오류가 발생했습니다.' });
                }
                res.status(200).json({ success: true, message: '게시글이 생성되었습니다.' });
            }
        );
    },

    // 게시글 수정 (기존 방식 그대로 유지)
    update_process: (req, res) => {
        console.log('board.update_process');

        const { name, cls, isLoggedIn } = authIsOwner(req);
        if (!isLoggedIn) {
            return res.status(403).json({ success: false, message: '권한이 없습니다.' });
        }

        const post = req.body;

        const sanitizedBoardId = sanitizeHtml(post.boardId);
        const sanitizedTypeId = sanitizeHtml(post.typeId);
        const sanitizedLoginId = sanitizeHtml(post.loginId);
        const sanitizedPassword = sanitizeHtml(post.password);
        const sanitizedTitle = sanitizeHtml(post.title);
        const sanitizedContent = sanitizeHtml(post.content);

        db.query(
            `SELECT * FROM board WHERE board_id = ?`,
            [sanitizedBoardId],
            (err, results) => {
                if (err) {
                    console.error('게시글 조회 오류:', err);
                    return res.status(500).json({ success: false, message: '게시글 조회 중 오류가 발생했습니다.' });
                }

                if (results.length === 0) {
                    return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
                }

                const storedPassword = results[0].password;

                if (cls === 'MNG' || (cls === 'CST' && sanitizedPassword === storedPassword)) {
                    db.query(
                        `UPDATE board SET loginid = ?, title = ?, date = NOW(), content = ? WHERE board_id = ?`,
                        [
                            sanitizedLoginId,
                            sanitizedTitle,
                            sanitizedContent,
                            sanitizedBoardId
                        ],
                        (err) => {
                            if (err) {
                                console.error('게시글 수정 오류:', err);
                                return res.status(500).json({ success: false, message: '게시글 수정 중 오류가 발생했습니다.' });
                            }
                            res.status(200).json({ success: true, message: '게시글이 수정되었습니다.' });
                        }
                    );
                } else {
                    res.status(403).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
                }
            }
        );
    },

    // 게시글 삭제 (기존 방식 그대로 유지)
    delete_process: (req, res) => {
        console.log('board.delete_process');

        const { name, cls, isLoggedIn } = authIsOwner(req);
        if (!isLoggedIn) {
            return res.status(403).json({ success: false, message: '권한이 없습니다.' });
        }

        const { boardId } = req.params;

        const sanitizedBoardId = sanitizeHtml(boardId);

        db.query(
            `SELECT * FROM board WHERE board_id = ?`,
            [sanitizedBoardId],
            (err, results) => {
                if (err) {
                    console.error('게시글 조회 오류:', err);
                    return res.status(500).json({ success: false, message: '게시글 조회 중 오류가 발생했습니다.' });
                }

                if (results.length === 0) {
                    return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
                }

                const loginId = results[0].loginid;

                if (cls === 'MNG' || name === loginId) {
                    db.query(
                        `DELETE FROM board WHERE board_id = ?`,
                        [sanitizedBoardId],
                        (err) => {
                            if (err) {
                                console.error('게시글 삭제 오류:', err);
                                return res.status(500).json({ success: false, message: '게시글 삭제 중 오류가 발생했습니다.' });
                            }
                            res.status(200).json({ success: true, message: '게시글이 삭제되었습니다.' });
                        }
                    );
                } else {
                    res.status(403).json({ success: false, message: '권한이 없습니다.' });
                }
            }
        );
    },
};
