let spriteSheet;

let chronoSheet;

 

let walkingAnimation;

let walkingAnimation2;

let chronoAnimation

let bugSpeed = 2;

let spriteSheetFilename = ["New Piskel.png"]

let spriteSheets = [];

let animations = [];

 

const GameState = {

Start: "Start",

Playng: "Playing",

GameOver: "GameOver"

};

 

let game = { score: 0, maxScore: 0, maxTime: 30, elapsedTime: 0, totalSprites: 15, state: GameState.Start, targetSprite: 2 };

 

function preload() {

for(let i=0; i < spriteSheetFilename.length; i++) {

spriteSheets[i] = loadImage("assets/" + spriteSheetFilename[i]);

}

}

 

function setup() {

createCanvas(400, 400);

imageMode(CENTER);

angleMode(DEGREES);

reset();

}

 

function reset() {

game.elapsedTime = 0;

game.score = 0;

game.totalSprites = random(5,10);

animations = []; 

for(let i=0; i < game.totalSprites; i++) {

animations[i] = new WalkingAnimation(random(spriteSheets),64,64,random(100,400),random(100,400),1,bugSpeed,1,random([0,1]));

}

}

 

function draw() {

switch(game.state) {

case GameState.Playing:

background(100);

for(let i=0; i < animations.length; i++) {

animations[i].draw();

}

fill(0);

textSize(40);

text(game.score,20,40);

let currentTime = game.maxTime - game.elapsedTime;

text(ceil(currentTime), 300,40);

game.elapsedTime += deltaTime / 1000;

if (currentTime < 0)

game.state = GameState.GameOver;

break;

case GameState.GameOver:

game.maxScore = max(game.score,game.maxScore);

//text

background(0);

fill(255);

textSize(40);

textAlign(CENTER);

text("Game Over!",200,200);

textSize(35);

text("Score: " + game.score,200,270);

text("Max Score: " + game.maxScore,200,320);

break;

case GameState.Start:

background(0);

fill(255);

textSize(50);

textAlign(CENTER);

text("Bug Game!",200,200);

textSize(30);

text("Press Any Key to Start",200,300);

break;

}

}

function keyPressed() {

switch(game.state) {

case GameState.Start:

game.state = GameState.Playing;

break;

case GameState.GameOver:

reset();

game.state = GameState.Playing;

break;

}

}

 

function mousePressed() {

switch(game.state) {

case GameState.Playing:


for (let i=0; i < animations.length; i++) {

 

let contains = animations[i].contains(mouseX,mouseY);

if (contains) {

if (animations[i].moving != 0) {

animations[i].stop();




if (animations[i].spritesheet === spriteSheets[game.targetSprite]){

game.score -= 1;

animations[i].bugSpeed();

}

else{

game.score += 1;

animations[i].bugSpeed();

}

 

}

// else {

// if (animations[i].xDirection === 1)

// animations[i].moveRight();

// else

// animations[i].moveLeft();

// }

}

}

break;

// case GameState.GameOver:

// reset();

// game.state = GameState.Playing;

// break;

}

}

 

class WalkingAnimation {

constructor(spritesheet, sw, sh, dx, dy, animationLength, speed, framerate, vertical = false, offsetX = 0, offsetY = 0) {

this.spritesheet = spritesheet;

this.sw = sw;

this.sh = sh;

this.dx = dx;

this.dy = dy;

this.u = 0;

this.v = 0;

this.animationLength = animationLength;

this.currentFrame = 0;

this.moving = 1;

this.xDirection = 1;

this.offsetX = offsetX;

this.offsetY = offsetY;

this.speed = speed;

this.framerate = framerate*speed;

this.vertical = vertical;

}

draw() {

// if (this.moving != 0)

// this.u = this.currentFrame % this.animationLength;

// else

// this.u = 0;

this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : this.u;

push();

translate(this.dx, this.dy);

// Check the direction and scale accordingly

if (this.xDirection === 1) {

scale(this.xDirection, 1, 1); // Original direction

} else {

scale(-1, 1, 1); // Flip horizontally for the opposite direction

}

if (this.xDirection === 1) {
  // Original direction (no flipping)
  scale( this.xDirection, -1, 1);
} else { 
  // Flip vertically for the opposite direction
  scale(1, 1,  1);
}
 

if (this.vertical)

rotate(90);

//rect(-26,-35,50,70);

image(this.spritesheet,0,0,this.sw,this.sh,this.u*this.sw+this.offsetX,this.v*this.sh+this.offsetY,this.sw,this.sh);

pop();

let proportionalFramerate = round(frameRate() / this.framerate);

if (frameCount % proportionalFramerate == 0) {

this.currentFrame++;

}

if (this.vertical) {

this.dx += this.moving*this.speed;

this.move(this.dx,this.sw / 4,height - this.sw / 4);

}

else {

this.dy += this.moving*this.speed;

this.move(this.dy,this.sw / 4,width - this.sw / 4);

}

}

move(position,lowerBounds,upperBounds) {

if (position > upperBounds) {

this.moveLeft();

} else if (position < lowerBounds) {

this.moveRight();

}

}

moveRight() {

this.moving = 1;

this.xDirection = 1;

this.v = 0;

}

moveLeft() {

this.moving = -1;

this.xDirection = -1;

this.v = 0;

}

keyPressed(right, left) {

if (keyCode === right) {

this.currentFrame = 1;

} else if (keyCode === left) {

this.currentFrame = 1;

}

}

keyReleased(right,left) {

if (keyCode === right || keyCode === left) {

this.moving = 0;

}

}

contains(x,y) {

//rect(-26,-35,50,70);

let insideX = x >= this.dx - 26 && x <= this.dx + 25;

let insideY = y >= this.dy - 35 && y <= this.dy + 35;

return insideX && insideY;

}

stop() {

this.moving = 0;

this.u = 0;

this.v = 2;

this.bugSpeed();

for(let i = 0; i < animations.length; i++){

  animations[i].bugSpeed();

}

}

 

bugSpeed(){

  this.speed += 1;

}

 

}

 