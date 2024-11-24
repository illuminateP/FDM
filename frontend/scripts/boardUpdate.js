document.addEventListener('DOMContentLoaded', () => {
    const updatePostForm = document.getElementById('updatePostForm');

    if (updatePostForm) {
        updatePostForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(updatePostForm);
            const postData = {
                boardId: formData.get('boardId'),
                typeId: formData.get('typeId'),
                title: formData.get('title'),
                password: formData.get('password'),
                content: formData.get('content'),
            };

            try {
                const response = await fetch('/api/board/update_process', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData),
                });

                if (response.ok) {
                    alert('게시글이 성공적으로 수정되었습니다!');
                    window.location.href = `/board/view/${postData.typeId}/1`;
                } else {
                    const error = await response.json();
                    alert(`게시글 수정 실패: ${error.message}`);
                }
            } catch (err) {
                console.error('Error updating post:', err);
                alert('게시글 수정 중 오류가 발생했습니다.');
            }
        });
    }
});
