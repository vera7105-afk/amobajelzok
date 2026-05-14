let gridSize = 3;
let board = [];
let currentPlayer = 'X';
let scores = { X: 0, O: 0 };
let currentCellIndex = -1;
let currentQuestion = null;
let gameActive = false;
let availableQuestions = [];

function initQuestions() {
    // Clone question bank so we can mutate the available array
    availableQuestions = [...questionBank];
}

function getRandomQuestion() {
    if (availableQuestions.length === 0) {
        initQuestions(); // Refill if empty
    }
    const idx = Math.floor(Math.random() * availableQuestions.length);
    const q = availableQuestions[idx];
    availableQuestions.splice(idx, 1); // Remove it so it doesn't repeat immediately
    return q;
}

function startGame(size) {
    gridSize = size;
    board = Array(size * size).fill('');
    currentPlayer = 'X';
    scores = { X: 0, O: 0 };
    gameActive = true;
    initQuestions();
    
    // Elrejtjük az eredmény modalt, ha látható lenne (új játék esetén)
    document.getElementById('result-modal').classList.remove('active');
    
    updateHeader();
    renderBoard();
}

function renderBoard(winningCells = []) {
    const boardEl = document.getElementById('board');
    boardEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    boardEl.innerHTML = '';
    
    board.forEach((cell, index) => {
        const cellEl = document.createElement('div');
        cellEl.className = `cell ${cell ? cell.toLowerCase() : ''}`;
        
        if (winningCells.includes(index)) {
            cellEl.classList.add('winning-cell');
        }
        
        cellEl.onclick = () => handleCellClick(index);
        
        if (!cell) {
            const num = document.createElement('span');
            num.className = 'cell-number';
            num.innerText = index + 1;
            cellEl.appendChild(num);
        } else {
            cellEl.innerText = cell;
        }
        
        boardEl.appendChild(cellEl);
    });
}

function updateHeader() {
    const pX = document.getElementById('current-player');
    pX.innerText = currentPlayer + ' csapat';
    pX.className = currentPlayer === 'X' ? 'player-x' : 'player-o';
    
    document.getElementById('score-x').innerText = scores.X;
    document.getElementById('score-o').innerText = scores.O;
}

function handleCellClick(index) {
    if (!gameActive || board[index] !== '') return;
    
    currentCellIndex = index;
    openQuestionModal();
}

function openQuestionModal() {
    currentQuestion = getRandomQuestion();
    
    document.getElementById('question-text').innerText = currentQuestion.question;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    const prefixes = ['A', 'B', 'C', 'D'];
    
    currentQuestion.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="option-prefix">${prefixes[idx]}</span> ${opt}`;
        btn.onclick = () => handleAnswer(idx, btn);
        optionsContainer.appendChild(btn);
    });
    
    document.getElementById('question-modal').classList.add('active');
}

function handleAnswer(selectedIndex, btnElement) {
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => {
        b.disabled = true;
        b.style.pointerEvents = 'none';
    });
    
    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    
    if (isCorrect) {
        btnElement.classList.add('correct');
        board[currentCellIndex] = currentPlayer;
    } else {
        btnElement.classList.add('wrong');
        allBtns[currentQuestion.correctIndex].classList.add('correct');
    }
    
    setTimeout(() => {
        document.getElementById('question-modal').classList.remove('active');
        
        if (isCorrect) {
            checkWin();
            if (gameActive) {
                switchPlayer();
                renderBoard();
            }
        } else {
            switchPlayer();
            renderBoard();
        }
    }, 2500); // 2.5 másodperc a válasz tanulmányozására
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateHeader();
}

function checkWin() {
    let won = false;
    let winningCells = [];
    
    const winPatterns = getWinPatterns(gridSize);
    
    for (const pattern of winPatterns) {
        let first = board[pattern[0]];
        if (first === '') continue;
        
        let isWin = true;
        for (let i = 1; i < gridSize; i++) {
            if (board[pattern[i]] !== first) {
                isWin = false;
                break;
            }
        }
        
        if (isWin) {
            won = true;
            winningCells = pattern;
            break;
        }
    }
    
    if (won) {
        gameActive = false;
        scores[currentPlayer]++;
        updateHeader();
        renderBoard(winningCells);
        
        setTimeout(() => showResult(`${currentPlayer} csapat nyert!`), 1000);
    } else if (!board.includes('')) {
        gameActive = false;
        renderBoard();
        setTimeout(() => showResult(`Döntetlen!`), 500);
    }
}

function getWinPatterns(size) {
    const patterns = [];
    for (let r = 0; r < size; r++) {
        const row = [];
        for (let c = 0; c < size; c++) {
            row.push(r * size + c);
        }
        patterns.push(row);
    }
    for (let c = 0; c < size; c++) {
        const col = [];
        for (let r = 0; r < size; r++) {
            col.push(r * size + c);
        }
        patterns.push(col);
    }
    const diag1 = [];
    const diag2 = [];
    for (let i = 0; i < size; i++) {
        diag1.push(i * size + i);
        diag2.push(i * size + (size - 1 - i));
    }
    patterns.push(diag1);
    patterns.push(diag2);
    
    return patterns;
}

function showResult(message) {
    const resultModal = document.getElementById('result-modal');
    document.getElementById('result-message').innerText = message;
    
    if (message.includes('X')) {
        document.getElementById('result-message').style.color = 'var(--x-color)';
    } else if (message.includes('O')) {
        document.getElementById('result-message').style.color = 'var(--o-color)';
    } else {
        document.getElementById('result-message').style.color = 'var(--text-color)';
    }
    
    resultModal.classList.add('active');
}

// Játék indítása automatikusan
startGame(3);
