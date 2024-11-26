const express = require('express');
const multer = require('multer');
const Minio = require('minio');
const fs = require('fs');
const router = express.Router();

// Multer 설정 (파일을 임시 저장)
const upload = multer({ dest: 'uploads/' });

// MinIO 클라이언트 설정 (리버스 프록시를 통해 접근)
const minioClient = new Minio.Client({
    endPoint: 'gctask.com', // 도커 네트워크에서 접근 가능한 NGINX 컨테이너 이름 사용
    port: 80, // NGINX 프록시 포트
    useSSL: false,
    accessKey: 'uploads',
    secretKey: 'uploads',
    pathStyle: true
});

// 파일 업로드 핸들러
router.post('/upload', upload.single('file'), async (req, res) => {
    console.log('uploadRouter called');
    const file = req.file;

    if (!file) {
        return res.status(400).json({ success: false, message: '파일이 업로드되지 않았습니다.' });
    }

    try {
        const bucketName = 'uploads';
        const objectName = file.filename;
        const filePath = file.path;

        // MinIO 클라이언트를 사용하여 파일을 업로드합니다.
        minioClient.fPutObject(bucketName, objectName, filePath, (err, etag) => {
            if (err) {
                console.error('File upload error:', err);
                return res.status(500).json({ success: false, message: '파일 업로드 중 오류가 발생했습니다.' });
            }
            console.log('File uploaded successfully:', etag);
            res.status(200).json({ success: true, message: '파일이 성공적으로 업로드되었습니다.', etag });
        });
    } catch (error) {
        console.error('파일 업로드 오류:', error);
        res.status(500).json({ success: false, message: '파일 업로드 중 오류가 발생했습니다.' });
    }
});

module.exports = router;
