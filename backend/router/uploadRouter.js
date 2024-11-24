const express = require('express');
const multer = require('multer');
const Minio = require('minio');
const db = require('./db');

const uploadRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// MiniO 클라이언트 설정
const minioClient = new Minio.Client({
    endPoint: 'minio-container',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

// 업로드 라우터
uploadRouter.post('/upload', upload.single('file'), (req, res) => {
    if (!req.session.is_logined) {
        return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
    }

    const file = req.file;
    if (!file) {
        return res.status(400).json({ success: false, message: '파일이 없습니다.' });
    }

    const bucketName = 'uploads';
    const objectName = `${Date.now()}_${file.originalname}`;

    // MiniO에 파일 업로드
    minioClient.putObject(bucketName, objectName, file.buffer, file.size, (err, etag) => {
        if (err) {
            console.error('파일 업로드 실패:', err);
            return res.status(500).json({ success: false, message: '파일 업로드 실패' });
        }

        console.log('파일 업로드 성공:', etag);

        // 사용자 포인트 증가
        const query = `UPDATE person SET point = point + 1 WHERE loginid = ?`;
        db.query(query, [req.session.loginid], (error, result) => {
            if (error) {
                console.error('포인트 업데이트 오류:', error);
                return res.status(500).json({ success: false, message: '포인트 업데이트 실패' });
            }

            res.status(200).json({ success: true, message: '업로드 성공!' });
        });
    });
});

// MiniO에 버킷 생성
minioClient.bucketExists('uploads', (err, exists) => {
    if (err) {
        return console.error('버킷 확인 실패:', err);
    }

    if (!exists) {
        minioClient.makeBucket('uploads', 'us-east-1', (err) => {
            if (err) {
                return console.error('버킷 생성 실패:', err);
            }
            console.log('uploads 버킷이 성공적으로 생성되었습니다.');
        });
    }
});

module.exports = uploadRouter;
