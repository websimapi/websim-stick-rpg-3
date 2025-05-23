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

// Click indicator properties
let clickIndicators = [];
const INDICATOR_MAX_DISTANCE_COLOR = 300; // pixels, for color transition
const INDICATOR_ARROW_SIZE = 8;
const INDICATOR_ARROW_OFFSET = 15;

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

    // Add a new click indicator
    const initialDist = Math.sqrt(Math.pow(player.targetX - player.x, 2) + Math.pow(player.targetY - player.y, 2));
    // Only add indicator if the click is not right on the player
    if (initialDist > player.speed) { // Avoid adding indicator if click is too close
        clickIndicators.push({
            x: player.targetX,
            y: player.targetY,
            initialDistance: initialDist
        });
    }
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

function drawClickIndicator(indicator) {
    const currentDistanceToPlayer = Math.sqrt(Math.pow(indicator.x - player.x, 2) + Math.pow(indicator.y - player.y, 2));

    // Remove indicator if player is very close to its target, or if initial distance was negligible
    if (currentDistanceToPlayer < player.speed || indicator.initialDistance < player.speed) {
        return false; // Indicate that it should be removed
    }

    // Calculate opacity based on remaining distance relative to initial distance.
    // Opacity is 1 when currentDistance is initialDistance, and 0 when currentDistance is 0.
    let opacity = currentDistanceToPlayer / indicator.initialDistance;
    opacity = Math.min(1, Math.max(0, opacity)); // Clamp opacity between 0 and 1

    // Calculate color (red to green based on player proximity)
    // Lerp factor: 0 means far (red), 1 means close (green)
    let colorFactor = 1 - Math.min(currentDistanceToPlayer / INDICATOR_MAX_DISTANCE_COLOR, 1);
    if (currentDistanceToPlayer < player.speed * 2) { // If player is very close/at target
        colorFactor = 1;
    }

    const r = Math.floor(255 * (1 - colorFactor));
    const g = Math.floor(255 * colorFactor);
    const b = 0;
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`; // USE NEW OPACITY
    ctx.lineWidth = 2;

    // Draw 4 arrows pointing inwards
    const directions = [
        { dx: 0, dy: -1 }, // Up
        { dx: 0, dy: 1 },  // Down
        { dx: -1, dy: 0 }, // Left
        { dx: 1, dy: 0 }   // Right
    ];

    for (const dir of directions) {
        ctx.beginPath();
        const startX = indicator.x + dir.dx * INDICATOR_ARROW_OFFSET;
        const startY = indicator.y + dir.dy * INDICATOR_ARROW_OFFSET;
        const endX = indicator.x + dir.dx * (INDICATOR_ARROW_OFFSET - INDICATOR_ARROW_SIZE);
        const endY = indicator.y + dir.dy * (INDICATOR_ARROW_OFFSET - INDICATOR_ARROW_SIZE);
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        // Arrowheads
        ctx.lineTo(endX - dir.dy * INDICATOR_ARROW_SIZE / 2 + dir.dx * INDICATOR_ARROW_SIZE / 2, endY + dir.dx * INDICATOR_ARROW_SIZE / 2 + dir.dy * INDICATOR_ARROW_SIZE / 2);
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX + dir.dy * INDICATOR_ARROW_SIZE / 2 + dir.dx * INDICATOR_ARROW_SIZE / 2, endY - dir.dx * INDICATOR_ARROW_SIZE / 2 + dir.dy * INDICATOR_ARROW_SIZE / 2);
        ctx.stroke();
    }
    return true;
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

    // Draw and update click indicators
    clickIndicators = clickIndicators.filter(indicator => drawClickIndicator(indicator));

    // --- Game logic will go here ---

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();