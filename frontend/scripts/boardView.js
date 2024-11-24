document.addEventListener('DOMContentLoaded', async () => {
    const boardsContainer = document.getElementById('boards');
    const writeButtonContainer = document.querySelector('.write-button');

    try {
        // 게시판 데이터 가져오기
        const response = await fetch('http://gctask.com/api/board/view/3');
        if (!response.ok) {
            throw new Error('게시글을 불러오는 데 실패했습니다.');
        }

        const { boards, cls } = await response.json();  

        // 게시판 글 목록 표시
        if (boards.length === 0) {
            boardsContainer.innerHTML = '<p>게시글이 없습니다. 글을 작성해 보세요!</p>';
        } else {
            console.log(boards);
            boards.forEach(board => {
                const boardItem = document.createElement('div');
                boardItem.classList.add('board-item');
                boardItem.innerHTML = `
                    <h2>${board.title}</h2>
                    <p>${board.content}</p>
                    <p>작성자: ${board.loginid} | 작성일: ${new Date(board.date).toLocaleString()}</p>
                    <a href="/api/board/detail/${board.board_id}">자세히 보기</a>
                `;
                boardsContainer.appendChild(boardItem);
            });
        }

        // 글 작성 버튼 추가 (조건부)
        if (cls === 'CST' || cls === 'MNG') {
            const writeButton = document.createElement('a');
            writeButton.href = '/api/board/3/create';
            writeButton.classList.add('btn');
            writeButton.innerText = '글 작성하기';
            writeButtonContainer.appendChild(writeButton);
        }
    } catch (error) {
        console.error(error);
        boardsContainer.innerHTML = '<p>게시글을 불러오는 데 실패했습니다.</p>';
    }
});
