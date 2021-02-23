// Canvas Context
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Keyboard Input Processing
const keyMap = { up: false, down: false, left: false, right: false, fire: false };
window.addEventListener("keydown", ProcessKeydown, false);
window.addEventListener("keyup", ProcessKeyup, false);

// Set Frame Processing Rate (milliseconds)
const timeBetweenFrames = 20;

//Backdrop
const sea = document.getElementById("sea");

// Submarine
const submarine = {
    img : document.getElementById("subR"), //Image
    x : 10, // X Position
    y : 10, // Y Position
    speed : 4, // Speed
    width : document.getElementById("subR").width, // Width
    height : document.getElementById("subR").height, // Height
    isActive : true,
    isFacingRight : true
}

// Begin Game Loop
setInterval( GameLoop, timeBetweenFrames);

// Main Processing Loop
function GameLoop() {
    ClearCanvas();
    ShipMovement();
    ShipCanvasCollisions();
    DrawSea();
    DrawSubmarine();
}


function ShipMovement() {

    // Handle Vertical Movement
    if ( keyMap.up ) { submarine.y -= submarine.speed; }
    if ( keyMap.down ) { submarine.y += submarine.speed; }

    // Handle Horizontal Movement
    // Change Direction Submarine is Facing
    if ( keyMap.left ) { 
        submarine.x -= submarine.speed;
        submarine.img = document.getElementById("subL");
        submarine.isFacingRight = false;
    }    
    if ( keyMap.right ) { 
        submarine.x += submarine.speed;
        submarine.img = document.getElementById("subR");
        submarine.isFacingRight = true;
    }    
}

function ShipCanvasCollisions() {
    const xMin = 0;
    const yMin = 0;
    const xMax = canvas.width - submarine.width;
    const yMax = canvas.height - submarine.height;

    if ( submarine.x < xMin) { submarine.x = xMin; }
    if ( submarine.x > xMax) { submarine.x = xMax; }
    if ( submarine.y < yMin) { submarine.y = yMin; }
    if ( submarine.y > yMax) { submarine.y = yMax; }
}

function DrawSubmarine() {
    if (submarine.isActive) {
        ctx.drawImage(submarine.img, submarine.x, submarine.y, submarine.width, submarine.height);
    }
}

function DrawSea() {
    ctx.drawImage(sea, 0, 0, canvas.width, canvas.height);
}

function ClearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function ProcessKeydown(e) {
    if (e.key == 'w' || e.key == 'ArrowUp') { keyMap.up = true; }
    if (e.key == 'a' || e.key == 'ArrowLeft') { keyMap.left = true; }
    if (e.key == 's' || e.key == 'ArrowDown') { keyMap.down = true; }
    if (e.key == 'd' || e.key == 'ArrowRight') { keyMap.right = true; }
    if (e.key == ' ') { keyMap.fire = true; }
}

function ProcessKeyup(e) {
    if (e.key == 'w' || e.key == 'ArrowUp') { keyMap.up = false; }
    if (e.key == 'a' || e.key == 'ArrowLeft') { keyMap.left = false; }
    if (e.key == 's' || e.key == 'ArrowDown') { keyMap.down = false; }
    if (e.key == 'd' || e.key == 'ArrowRight') { keyMap.right = false; }
    if (e.key == ' ') { keyMap.fire = false; }
}

