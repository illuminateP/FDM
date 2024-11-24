document.addEventListener('DOMContentLoaded', () => {
    const createPostForm = document.getElementById('createPostForm');

    if (createPostForm) {
        createPostForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(createPostForm);
            const postData = {
                typeId: formData.get('typeId'),
                title: formData.get('title'),
                password: formData.get('password'),
                content: formData.get('content'),
            };

            try {
                const response = await fetch('/api/board/create_process', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData),
                });

                if (response.ok) {
                    alert('게시글이 성공적으로 작성되었습니다!');
                    window.location.href = `/board/view/${postData.typeId}/1`;
                } else {
                    const error = await response.json();
                    alert(`게시글 작성 실패: ${error.message}`);
                }
            } catch (err) {
                console.error('Error creating post:', err);
                alert('게시글 작성 중 오류가 발생했습니다.');
            }
        });
    }
});
