const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');
const replayButton = document.getElementById('replayButton');

// Game settings
const gameWidth = canvas.width;
const gameHeight = canvas.height;

// Player settings
const player = {
  x: gameWidth / 2 - 25,
  y: gameHeight - 60,
  width: 50,
  height: 50,
  speed: 5,
  dx: 0,
  dy: 0
};

// Obstacles settings
let obstacles = [];
const obstacleWidth = 50;
const obstacleHeight = 50;
const obstacleSpeed = 15;
let obstacleFrequency = 10; // Higher value means less frequent
let frameCount = 0;

// Game state
let isGameOver = false;
let score = 0;

// Event listeners for player movement
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
playButton.addEventListener('click', startGame);
replayButton.addEventListener('click', resetGame);

function keyDownHandler(e) {
  if (e.key === 'ArrowRight' || e.key === 'Right') {
    player.dx = player.speed;
  } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
    player.dx = -player.speed;
  } else if (e.key === 'ArrowUp' || e.key === 'Up') {
    player.dy = -player.speed;
  } else if (e.key === 'ArrowDown' || e.key === 'Down') {
    player.dy = player.speed;
  }
}

function keyUpHandler(e) {
  if (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'ArrowLeft' || e.key === 'Left') {
    player.dx = 0;
  } else if (e.key === 'ArrowUp' || e.key === 'Up' || e.key === 'ArrowDown' || e.key === 'Down') {
    player.dy = 0;
  }
}

function createObstacle() {
  const x = Math.random() * (gameWidth - obstacleWidth);
  const y = -obstacleHeight;
  obstacles.push({ x, y, width: obstacleWidth, height: obstacleHeight, speed: obstacleSpeed });
}

function updateObstacles() {
  frameCount++;
  if (frameCount % obstacleFrequency === 0) {
    createObstacle();
  }

  obstacles.forEach((obstacle, index) => {
    obstacle.y += obstacle.speed;

    if (obstacle.y > gameHeight) {
      obstacles.splice(index, 1);
      score++;
    }

    if (detectCollision(player, obstacle)) {
      isGameOver = true;
      replayButton.style.display = 'block'; // Show the replay button
    }
  });
}

function detectCollision(player, obstacle) {
  return (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  );
}

function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  ctx.fillStyle = 'red';
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function clearCanvas() {
  ctx.clearRect(0, 0, gameWidth, gameHeight);
}

function updatePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  // Prevent player from going out of bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > gameWidth) player.x = gameWidth - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > gameHeight) player.y = gameHeight - player.height;
}

function gameLoop() {
  if (isGameOver) {
    ctx.fillStyle = 'black';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', gameWidth / 2 - 150, gameHeight / 2);
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${score}`, gameWidth / 2 - 70, gameHeight / 2 + 50);
    return;
  }

  clearCanvas();
  updatePlayer();
  updateObstacles();
  drawPlayer();
  drawObstacles();
  drawScore();
  
  requestAnimationFrame(gameLoop);
}

function startGame() {
  playButton.style.display = 'none'; // Hide the play button
  canvas.style.display = 'block'; // Show the canvas
  gameLoop();
}

function resetGame() {
  isGameOver = false;
  score = 0;
  frameCount = 0;
  obstacles = [];
  player.x = gameWidth / 2 - 25;
  player.y = gameHeight - 60;
  replayButton.style.display = 'none'; // Hide the replay button
  gameLoop();
}
