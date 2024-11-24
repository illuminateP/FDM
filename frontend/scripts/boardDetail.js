document.addEventListener('DOMContentLoaded', () => {
    const createCommentForm = document.getElementById('createCommentForm');

    if (createCommentForm) {
        createCommentForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(createCommentForm);
            const commentData = {
                boardId: formData.get('boardId'),
                content: formData.get('content'),
            };

            try {
                const response = await fetch('/api/comment/create_process', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(commentData),
                });

                if (response.ok) {
                    alert('댓글이 성공적으로 작성되었습니다!');
                    window.location.reload();
                } else {
                    const error = await response.json();
                    alert(`댓글 작성 실패: ${error.message}`);
                }
            } catch (err) {
                console.error('Error creating comment:', err);
                alert('댓글 작성 중 오류가 발생했습니다.');
            }
        });
    }
});
