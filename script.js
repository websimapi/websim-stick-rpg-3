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

    // Player (simple rectangle for now)
    ctx.fillStyle = 'blue';
    ctx.fillRect(canvas.width / 2 - 25, canvas.height / 2 - 25, 50, 50); // Centered player

    // --- Game logic will go here ---

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();