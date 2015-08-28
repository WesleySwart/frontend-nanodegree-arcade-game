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

    this.spawnRate = 3000;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += this.speed * dt;

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.sprite = 'images/char-boy.png';

    //hitbox dimensions
    this.width = 50;
    this.height = 75;

    this.speed = 30; //Initial speed

    //this.score = 0;
};

Player.prototype.update = function(){

};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(allowedKeys){

    var key = allowedKeys;

    //Prevents player from moving during pause
    if(isPaused && key != 'space'){
        return;
    }

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
                scoreBoard.score += 10;
                gameState = gameStateEnum.Reset;
                //console.log("State: " + gameState.toString());
            }
            break;
        case 'down':
            if(this.y < 435){
                this.y += this.speed;
            }
            break;
        case 'space':
            //Pause or unpause game
            isPaused = !isPaused;
            if(isPaused){
                /*console.log("Pause Game");
                timer.stopTimer();
                stopSpawnInterval();*/
                pauseGame();
            }
            else{
                /*console.log("Unpause Game");
                resumeGame = true;
                timer.startTimer();
                newEnemy();
                startSpawnInterval(enemy.spawnRate);*/
                unpauseGame();
            }
    }
};

var ScoreBoard = function(){
    this.textColor = 'white';
    this.fontSize = '32px Verdana';
    this.score = 0;
};

ScoreBoard.prototype.update = function(){
    
    if(this.score < 0){
        this.score = 0;
    }
};

ScoreBoard.prototype.render = function(){
    ctx.fillStyle = this.textColor;
    ctx.font = this.fontSize;
    ctx.fillText("Score: " + this.score, 15, 125);
};

var Timer = function(){
    this.textColor = 'white';
    this.fontSize = '32px Verdana';
    this.isRunning = false;
    this.startTime = 0;
    this.duration = 60;
    this.timeLeft = 0;
};

Timer.prototype.update = function(){
    if(this.isRunning){
        this.timeLeft = this.duration - parseInt((Date.now() - this.startTime)/1000);
        if(this.timeLeft <= 0){
            this.timeLeft = 0;
            this.stopTimer();
            gameState = gameStateEnum.GameOver;
        }
    }
};

Timer.prototype.startTimer = function(){
    this.isRunning = true;
    this.startTime = Date.now();
};

Timer.prototype.stopTimer = function(){
    this.isRunning = false;
    //Pause timer. Maintains time left by setting it equal to itself when paused.
    if(isPaused){
        this.duration = this.timeLeft;
    }
};

Timer.prototype.render = function(){
    ctx.fillStyle = this.textColor;
    ctx.font = this.fontSize;

    if(this.timeLeft === 0){
        ctx.fillText("Time's up!", 15, 90);
    }
    else{
        ctx.fillText("Time left: " + this.timeLeft, 15, 90);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var enemy = new Enemy();
var scoreBoard = new ScoreBoard();
var spawnRate = enemy.spawnRate; //in milliseconds
var spawnInterval;
var timer = new Timer();

timer.startTimer();
allEnemies = [];
newEnemy();
startSpawnInterval(spawnRate);

function startSpawnInterval(spawnRate ){
    spawnInterval = setInterval(newEnemy, spawnRate);
}

function stopSpawnInterval(){
    clearInterval(spawnInterval);
}

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

function pauseGame(){
    console.log("Pause Game");
    timer.stopTimer();
    stopSpawnInterval();
}

function unpauseGame(){
    console.log("Unpause Game");
    resumeGame = true;
    timer.startTimer();
    newEnemy();
    startSpawnInterval(enemy.spawnRate);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
