const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player properties
let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    targetX: canvas.width / 2,
    targetY: canvas.height / 2,
    speed: 2, // pixels per frame
    headRadius: 15,
    bodyLength: 40,
    limbLength: 25
};

// Adjust canvas to screen size
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    // Re-center player if canvas resizes and they are at the initial position
    if (player.x === player.targetX && player.y === player.targetY) {
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
        player.targetX = canvas.width / 2;
        player.targetY = canvas.height / 2;
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial resize

// Handle mouse clicks for movement
canvas.addEventListener('mousedown', function(event) {
    const rect = canvas.getBoundingClientRect();
    player.targetX = event.clientX - rect.left;
    player.targetY = event.clientY - rect.top;
});

function drawPlayer() {
    ctx.strokeStyle = 'black'; // Color of the stick figure
    ctx.lineWidth = 3;

    // Head
    ctx.beginPath();
    ctx.arc(player.x, player.y - player.headRadius - player.bodyLength / 2, player.headRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(player.x, player.y - player.bodyLength / 2);
    ctx.lineTo(player.x, player.y + player.bodyLength / 2);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(player.x, player.y - player.bodyLength / 4); // Shoulder
    ctx.lineTo(player.x - player.limbLength, player.y - player.bodyLength / 4 + player.limbLength / 2); // Left hand
    ctx.moveTo(player.x, player.y - player.bodyLength / 4); // Shoulder
    ctx.lineTo(player.x + player.limbLength, player.y - player.bodyLength / 4 + player.limbLength / 2); // Right hand
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(player.x, player.y + player.bodyLength / 2); // Hip
    ctx.lineTo(player.x - player.limbLength / 1.5, player.y + player.bodyLength / 2 + player.limbLength); // Left foot
    ctx.moveTo(player.x, player.y + player.bodyLength / 2); // Hip
    ctx.lineTo(player.x + player.limbLength / 1.5, player.y + player.bodyLength / 2 + player.limbLength); // Right foot
    ctx.stroke();
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move player towards target
    const dx = player.targetX - player.x;
    const dy = player.targetY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > player.speed) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
    } else if (distance > 0) { // Snap to target if very close
        player.x = player.targetX;
        player.y = player.targetY;
    }

    // --- Drawing code will go here ---
    drawPlayer();

    // --- Game logic will go here ---

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();