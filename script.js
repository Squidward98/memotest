const images = [
    '1.png', '1.png',
    '2.png', '2.png',
    '3.png', '3.png',
    '4.png', '4.png',
    '5.png', '5.png',
    '6.png', '6.png',
    '7.png', '7.png',
    '8.png', '8.png',
];

let flippedCards = [];
let matchedPairs = 0;
let startTime;
let timerInterval;
let leaderboard;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    startTime = Date.now(); // Establecer startTime en el momento en que se llama a la función
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('timer').innerText = `Tiempo: ${elapsedTime} segundos`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    return Math.floor((Date.now() - startTime) / 1000);
}

function createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    shuffle(images);
    images.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;

        const cardImage = document.createElement('img');
        cardImage.src = `images/${image}`;
        card.appendChild(cardImage);

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (this.classList.contains('flipped') || flippedCards.length === 2) {
        return;
    }

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        setTimeout(checkForMatch, 1000);
        if (!startTime) {
            startTimer();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.image === card2.dataset.image;

    if (isMatch) {
        matchedPairs += 1;
        if (matchedPairs === images.length / 2) {
            const elapsedTime = stopTimer();
            setTimeout(() => {
                const playerName = prompt('¡Felicidades! Has ganado. Ingresa tu nombre:');
                if (playerName) {
                    updateLeaderboard(playerName, elapsedTime);
                }
                resetGame();
            }, 500);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }

    flippedCards = [];
}

function updateLeaderboard(name, time) {
    leaderboard.push({ name, time });
    leaderboard.sort((a, b) => a.time - b.time);
    leaderboard = leaderboard.slice(0, 5); // Keep only top 5 scores
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function loadLeaderboard() {
    leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
}

function showLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    leaderboard.forEach((player, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${player.name}: ${player.time} segundos`;
        leaderboardList.appendChild(listItem);
        if (index < 3) {
            listItem.style.fontWeight = 'bold';
        }
    });
    document.getElementById('leaderboard').classList.remove('hidden');
}

function resetGame() {
    matchedPairs = 0;
    flippedCards = [];
    clearInterval(timerInterval); // Detener el intervalo del temporizador
    startTime = null; // Restablecer startTime a null
    document.getElementById('timer').innerText = 'Tiempo: 0 segundos'; // Reiniciar el contador de tiempo en el DOM
    createBoard();
}

document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
    createBoard();

    const restartBtn = document.getElementById('restart-btn');
    restartBtn.addEventListener('click', resetGame);

    const leaderboardBtn = document.getElementById('leaderboard-btn');
    leaderboardBtn.addEventListener('click', showLeaderboard);
});

// Función para resetear el archivo scores.json
function resetScores() {
    localStorage.removeItem('leaderboard');
    alert('¡Los puntajes se han reseteado correctamente!');
}

// Función para descargar el archivo scores.json
/* function downloadScores() {
    const leaderboard = localStorage.getItem('leaderboard');
    if (!leaderboard) {
        alert('No hay puntajes para descargar.');
        return;
    }

    const jsonData = JSON.stringify(JSON.parse(leaderboard), null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'scores.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
} */