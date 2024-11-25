document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    
    formData.append('file', fileInput.files[0]);
    
    try {
        const response = await fetch('http://gctask.com/api/image/upload', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('파일 업로드 성공!');
            window.location.href = '/home.html'; // 업로드 성공 후 홈으로 리다이렉트
        } else {
            alert('파일 업로드 실패. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error('파일 업로드 중 오류 발생:', error);
        alert('파일 업로드 중 오류가 발생했습니다.');
    }
});
