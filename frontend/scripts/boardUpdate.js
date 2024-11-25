document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
            const response = await fetch('/board/update_process', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('게시글이 성공적으로 수정되었습니다.');
                window.location.href = `/board/view/${formData.get('type_id')}/${formData.get('pNum')}`;
            } else {
                alert('게시글 수정에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('게시글 수정 중 오류가 발생했습니다.');
        }
    });
});
