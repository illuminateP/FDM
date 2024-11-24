document.addEventListener("DOMContentLoaded", async () => {
    const userPoints = document.getElementById('user-points');
    const userGrade = document.getElementById('user-grade');
    const userClass = document.getElementById('user-class');

    try {
        const response = await fetch('/api/user-info');
        console.log(response);
        if (!response.ok) {
            throw new Error('사용자 정보를 불러오지 못했습니다.');
        }

        const data = await response.json();

        if (data.error) {
            userPoints.textContent = '포인트: -';
            userGrade.textContent = '등급: -';
            userClass.textContent = '클래스: -';
        } else {
            userPoints.textContent = `포인트: ${data.point || 'N/A'}`;
            userGrade.textContent = `등급: ${data.grade || 'N/A'}`;
            userClass.textContent = `클래스: ${data.class || 'N/A'}`;
        }
    } catch (error) {
        console.error('사용자 정보 오류:', error);
    }
});
