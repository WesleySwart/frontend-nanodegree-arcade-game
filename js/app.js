// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    //hitbox dimensions
    this.width = 75;
    this.height = 75;

    speedMin = 30;
    speedMax = 200;

    //Initial speed
    this.speed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += this.speed * dt;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.sprite = 'images/char-boy.png';

    //hitbox dimensions
    this.width = 50;
    this.height = 75;

    this.speed = 30; //Initial speed

    this.score = 0;
}

Player.prototype.update = function(){

    if(this.score < 0){
        this.score = 0;
    }
}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.fillStyle = "white";
    ctx.font = '36px Verdana';
    ctx.fillText("Score: " + this.score, 15, 90);
}

Player.prototype.handleInput = function(allowedKeys){

    var key = allowedKeys;

    //Set boundaries and move player
    switch(key){
        case 'left':
            if(this.x > 0){
                this.x -= this.speed;
            }
            break;
        case 'right':
            if(this.x < 410){
                this.x += this.speed;
            }
            break;
        case 'up':
            if(this.y > 0){
                this.y -= this.speed;
            }
            else{
                //Player reached the water. Add score and reset player.
                this.score += 10;
                gameState = gameStateEnum.Reset;
                console.log("State: " + gameState.toString());
            }
            break;
        case 'down':
            if(this.y < 435){
                this.y += this.speed;
            }
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var enemy = new Enemy();
var spawnRate = 3000; //in milliseconds
var startTime = new Date().getTime();
allEnemies = [];
allEnemies.push(enemy);

var spawnInterval = setInterval(function(){
  newEnemy();
}, spawnRate);

//Create new enemy using random positions
function newEnemy(){

    var enemyXPosition = -100;
    var enemyYPositions = [65, 145, 225, 310];
    var enemy = new Enemy();
    var randomEnemyPosition = Math.floor(Math.random() * (enemyYPositions.length));

    enemy.x = enemyXPosition;
    enemy.y = enemyYPositions[randomEnemyPosition];
    allEnemies.push(enemy);
}

//Game Timer
function createTimer(seconds){
    interval = setInterval(function(){
        ctx.beginPath();
        if(seconds === 0){
            clearInterval(interval);
            ctx.font = "20px Verdana";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Time's up!", ctx.canvas.width - 75, 25);
            return;
        }
        ctx.font = "20px Verdana";
        if(seconds <= 10 && seconds > 5){
            ctx.fillStyle = "orangered";
        }
        else if(seconds <= 5){
            ctx.fillStyle = "red";
        }
        else{
            ctx.fillStyle = "black";
        }
        var minutes = Math.floor(seconds/60);
        var secs = (seconds - minutes* 60).toString();
        if(secs.length === 1){
            secs = "0" + secs;
        }
        ctx.fillText(minutes.toString() + ":" + secs, ctx.canvas.width - 75, 25);
        seconds--;
        ctx.closePath();
    }, 1000);
}

//createTimer(10);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
