const express = require('express');
const multer = require('multer');
const axios = require('axios'); // axios로 변경
const fs = require('fs');
const router = express.Router();

// Multer 설정 (파일을 임시 저장)
const upload = multer({ dest: 'uploads/' });

// 파일 업로드 핸들러
router.post('/upload', upload.single('file'), async (req, res) => {
    console.log('uploadRouter called');
    const file = req.file;

    if (!file) {
        return res.status(400).json({ success: false, message: '파일이 업로드되지 않았습니다.' });
    }

    try {
        // NGINX 리버스 프록시 경로를 통해 MinIO로 전송
        const minioUploadUrl = 'http://nginx-container/image/uploads/' + file.filename;

        // 파일의 Content-Length를 가져오기 위해 파일 크기 계산
        const fileSize = fs.statSync(file.path).size;

        const response = await axios.put(minioUploadUrl, fs.createReadStream(file.path), {
            headers: {
                'Content-Type': file.mimetype,
                'Content-Length': fileSize, // 파일의 길이 설정
            },
        });

        if (response.status === 200) {
            console.log('파일 업로드 성공.');

            // 임시 파일 삭제
            fs.unlink(file.path, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('임시 파일 삭제 오류:', unlinkErr);
                }
            });

            res.status(200).json({ success: true, message: '파일 업로드 성공!' });
        } else {
            console.error('MinIO 업로드 오류:', response.statusText);
            res.status(500).json({ success: false, message: '파일 업로드 중 오류가 발생했습니다.' });
        }
    } catch (error) {
        console.error('파일 업로드 오류:', error);
        res.status(500).json({ success: false, message: '파일 업로드 중 오류가 발생했습니다.' });
    }
});

module.exports = router;
