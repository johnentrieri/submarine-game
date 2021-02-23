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

// Torpedo
const torpedo = {
    img : document.getElementById("torpedoL"), //Image
    x : 0, // X Position
    y : 0, // Y Position
    speed : 11, // Speed
    width : document.getElementById("torpedoL").width, // Width
    height : document.getElementById("torpedoL").height, // Height
    isActive : false,
    isFacingRight : true
}

// Target
const target = {
    img : document.getElementById("target"), //Image
    x : 0, // X Position
    y : 0, // Y Position
    width : document.getElementById("target").width, // Width
    height : document.getElementById("target").height, // Height
    isActive : false,
}

// Initialize Score
let score = -1;

// Initialize Timer
let timer = 30 * 1000;

// Begin Game Loop
setInterval( GameLoop, timeBetweenFrames);

// Main Processing Loop
function GameLoop() {
    ClearCanvas();
    ShipMovement();
    TorpedoProcessing();
    ShipCanvasCollisions();
    TorpedoCanvasCollisions();
    TorpedoTargetCollisions();
    DrawSea();
    DrawTarget();
    DrawSubmarine();
    DrawTorpedo();
    DisplayTimer();
    DisplayScore();
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

function TorpedoProcessing() {

    // Fire Torpedo
    if (keyMap.fire && !torpedo.isActive) { FireTorpedo(); }

    // Handle Torpedo Movement
    if (torpedo.isActive) {
        if (torpedo.isFacingRight) {
            torpedo.x += torpedo.speed;
        } else {
            torpedo.x -= torpedo.speed;
        }
    }    
}

function FireTorpedo() {

    // Spawn Torpedo Facing Same Direction as Submarine
    if (submarine.isFacingRight) {
        torpedo.img = document.getElementById("torpedoR");
        torpedo.isFacingRight = true;
    } else {
        torpedo.img = document.getElementById("torpedoL");
        torpedo.isFacingRight = false;
    }

    // Spawn Torpedo Underneath Submarine
    torpedo.x = submarine.x + ( submarine.width / 2 );
    torpedo.y = submarine.y + (submarine.height);
    torpedo.isActive = true;
}

function ExplodeTorpedo() {
    torpedo.isActive = false;
}

function ExplodeTarget() {
    target.isActive = false;
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

function TorpedoCanvasCollisions() {
    const xMin = 0;
    const yMin = 0;
    const xMax = canvas.width - torpedo.width;
    const yMax = canvas.height - torpedo.height;

    if ( torpedo.x < xMin) { ExplodeTorpedo(); }
    if ( torpedo.x > xMax) { ExplodeTorpedo(); }
    if ( torpedo.y < yMin) { ExplodeTorpedo(); }
    if ( torpedo.y > yMax) { ExplodeTorpedo(); }
}

function TorpedoTargetCollisions() {
    const torpedoX1 = torpedo.x;
    const torpedoY1 = torpedo.y;
    const torpedoX2 = torpedo.x + torpedo.width;
    const torpedoY2 = torpedo.y + torpedo.height;

    const targetX1 = target.x;
    const targetY1 = target.y;
    const targetX2 = target.x + target.width;
    const targetY2 = target.y + target.height;

    if ((torpedoX1 <= targetX2) && (torpedoX2 >= targetX1) && (torpedoY1 <= targetY2) && (torpedoY2 >= targetY1)) {
        ExplodeTorpedo();
        ExplodeTarget();
        score++;
    }
}

function DrawSubmarine() {
    if (submarine.isActive) {
        ctx.drawImage(submarine.img, submarine.x, submarine.y, submarine.width, submarine.height);
    }
}

function DrawTorpedo() {
    if (torpedo.isActive) {
        ctx.drawImage(torpedo.img, torpedo.x, torpedo.y, torpedo.width, torpedo.height);
    }
}

function DrawTarget() {
    if (target.isActive) {
        ctx.drawImage(target.img, target.x, target.y, target.width, target.height);
    } else {
        const xMax = canvas.width - target.width;
        const yMax = canvas.height - target.height;

        target.x = Math.floor(Math.random() * xMax);
        target.y = Math.floor(Math.random() * yMax);

        target.isActive = true;
        ctx.drawImage(target.img, target.x, target.y, target.width, target.height);
    }
}

function DisplayTimer() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Time: " + Math.ceil(timer/1000), 10, 50);
    timer -= timeBetweenFrames
    if ( timer < 0) { timer = 0; }
}

function DisplayScore() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 10, 90); 
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

