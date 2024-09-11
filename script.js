const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const matrixCanvas = document.getElementById('matrixCanvas');
const matrixCtx = matrixCanvas.getContext('2d');

// Configuração do efeito Matrix
matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;
const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
const fontSize = 10;
const columns = matrixCanvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    matrixCtx.fillStyle = '#0f0';
    matrixCtx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Configuração do jogo da cobrinha
const gridSize = 20;
const tileCount = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;

function drawGame() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    drawScore();
    applyParallax(); // Adicione esta linha
}

function clearCanvas() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = '#0f0';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function checkCollision() {
    if (snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= tileCount) {
        gameOver();
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            gameOver();
        }
    }
}

function gameOver() {
    gameOverMessage.classList.remove('hidden');
    clearInterval(gameInterval);
    clearInterval(matrixInterval);
}

function restartGame() {
    gameOverMessage.classList.add('hidden');
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    generateFood();
    gameInterval = setInterval(drawGame, 100);
    matrixInterval = setInterval(drawMatrix, 50);
}

const gameOverMessage = document.getElementById('gameOverMessage');
const subscribeButton = document.getElementById('subscribeButton');

subscribeButton.addEventListener('click', restartGame);

function drawScore() {
    ctx.fillStyle = '#0f0';
    ctx.font = '20px Courier New';
    ctx.fillText(`Pontuação: ${score}`, 10, 30);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

document.addEventListener('keydown', changeDirection);
let gameInterval = setInterval(drawGame, 100);
let matrixInterval = setInterval(drawMatrix, 50);

// Ajustar o tamanho do canvas Matrix quando a janela for redimensionada
window.addEventListener('resize', () => {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
});

// Adicione estas variáveis no início do arquivo
let mouseX = 0;
let mouseY = 0;

// Adicione esta função para atualizar a posição do mouse
function updateMousePosition(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

// Adicione esta função para aplicar o efeito parallax
function applyParallax() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const moveX = (mouseX - centerX) / 50;
    const moveY = (mouseY - centerY) / 50;

    matrixCanvas.style.transform = `translate(${moveX}px, ${moveY}px)`;
    canvas.style.transform = `translate(${-moveX * 0.5}px, ${-moveY * 0.5}px)`;
}

// Adicione este evento de listener no final do arquivo
document.addEventListener('mousemove', updateMousePosition);