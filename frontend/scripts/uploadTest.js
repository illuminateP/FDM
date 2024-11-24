
document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('파일을 선택하세요.');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('업로드 성공!');
            window.location.href = '/home.html';
        } else {
            throw new Error('파일 업로드 실패');
        }
    } catch (error) {
        console.error('업로드 중 오류 발생:', error);
        alert('업로드 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
});
