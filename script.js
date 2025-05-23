const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Adjust canvas to screen size
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial resize

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- Drawing code will go here ---

    // Player (stick figure)
    const playerX = canvas.width / 2;
    const playerY = canvas.height / 2;
    const headRadius = 15;
    const bodyLength = 40;
    const limbLength = 25;

    ctx.strokeStyle = 'black'; // Color of the stick figure
    ctx.lineWidth = 3;

    // Head
    ctx.beginPath();
    ctx.arc(playerX, playerY - headRadius - bodyLength / 2, headRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(playerX, playerY - bodyLength / 2);
    ctx.lineTo(playerX, playerY + bodyLength / 2);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(playerX, playerY - bodyLength / 4); // Shoulder
    ctx.lineTo(playerX - limbLength, playerY - bodyLength / 4 + limbLength / 2); // Left hand
    ctx.moveTo(playerX, playerY - bodyLength / 4); // Shoulder
    ctx.lineTo(playerX + limbLength, playerY - bodyLength / 4 + limbLength / 2); // Right hand
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(playerX, playerY + bodyLength / 2); // Hip
    ctx.lineTo(playerX - limbLength / 1.5, playerY + bodyLength / 2 + limbLength); // Left foot
    ctx.moveTo(playerX, playerY + bodyLength / 2); // Hip
    ctx.lineTo(playerX + limbLength / 1.5, playerY + bodyLength / 2 + limbLength); // Right foot
    ctx.stroke();

    // --- Game logic will go here ---

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();