document.addEventListener('DOMContentLoaded', async () => {
    const boardsContainer = document.getElementById('boards');
    const writeButtonContainer = document.querySelector('.write-button');
    const paginationContainer = document.querySelector('.pagination');

    try {
        // 게시판 데이터 가져오기
        const response = await fetch('http://gctask.com/api/board/view');
        if (!response.ok) {
            throw new Error('게시글을 불러오는 데 실패했습니다.');
        }

        const { boards = [], cls, pNum = 1, totalPages = 1 } = await response.json();

        // 게시글 목록 표시
        if (boardsContainer) {
            if (boards.length === 0) {
                boardsContainer.innerHTML = '<p>게시글이 없습니다. 글을 작성해 보세요!</p>';
            } else {
                boardsContainer.innerHTML = '';
                boards.forEach(board => {
                    const boardItem = document.createElement('div');
                    boardItem.classList.add('board-item');
                    boardItem.innerHTML = `
                        <h2><a href="/board/detail/${board.board_id}">${board.title}</a></h2>
                        <p>작성자: ${board.name} | 작성일: ${board.date}</p>
                    `;
                    boardsContainer.appendChild(boardItem);
                });
            }
        }

        // 글 작성 버튼 추가 (조건부)
        if (cls != 'GUEST') {
            writeButtonContainer.innerHTML = '';
            const writeButton = document.createElement('a');
            writeButton.href = '../boardCreate.html';
            writeButton.classList.add('btn');
            writeButton.innerText = '글 작성하기';
            writeButtonContainer.appendChild(writeButton);
        }

        // 페이지네이션 표시
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
            for (let j = 1; j <= totalPages; j++) {
                const pageSpan = document.createElement('span');
                if (j === pNum) {
                    pageSpan.style.fontWeight = 'bold';
                    pageSpan.innerText = j;
                } else {
                    const pageLink = document.createElement('a');
                    pageLink.href = `/board/view/3/${j}`;
                    pageLink.innerText = j;
                    pageSpan.appendChild(pageLink);
                }
                paginationContainer.appendChild(pageSpan);
                paginationContainer.appendChild(document.createTextNode(' '));
            }
        }
    } catch (error) {
        console.error(error);
        if (boardsContainer) {
            boardsContainer.innerHTML = '<p>게시글을 불러오는 데 실패했습니다.</p>';
        }
    }
});
