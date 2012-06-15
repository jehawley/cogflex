// gameObjects.js
// Contains Game Object prototype and all game objects

function GameObject(topHeight, posX, posY, drawFun, type) {
  this.topHeight = topHeight || 0;
  this.posX = posX || 0;
  this.posY = posY || 0;
  this.draw = drawFun;
  // "Intersection types are: Composite, BB, AABB, Circle, Ellipse, None
  this.intersectionType = type || "None";
}

function Ship(posX, posY, drawFun) {
  this.base = GameObject;
  this.base(OFFSET, posX, posY, drawFun, "Composite");
  this.move = moveShip;
}
Ship.prototype = new GameObject;

function Coin(centerX, centerY, radius, drawFun) {
  this.base = GameObject;
  this.base(posY - radius, centerX, centerY, drawFun, 'Circle');
  this.radius = radius;
}
Coin.prototype = new GameObject;

function Enemy(centerX, centerY, sideLength, drawFun) {
  this.base = GameObject;
  this.base(posY - sideLength / 2, centerX, centerY, drawFun, 'AABB');
  this.sideLength = sideLength;
}
Enemy.prototype = new GameObject;

function Barrier(topHeight, length, drawFun) {
  this.base = GameObject;
  this.base(topHeight, WIDTH / 2, topHeight, drawFun, 'AABB');
  this.length = length;
}
Barrier.prototype = new GameObject;


// Drawing Methods

function drawBasicShip() {
  ctx.beginPath();

  ctx.fillStyle = 'rgb(0, 0, 200)';
  ctx.moveTo(this.posX - SHIP_WIDTH / 2, this.posY - SHIP_WIDTH / 2);
  ctx.lineTo(this.posX, this.posY - SHIP_WIDTH / 4);
  ctx.lineTo(this.posX + SHIP_WIDTH / 2, this.posY - SHIP_WIDTH / 2);
  ctx.lineTo(this.posX, this.posY + SHIP_WIDTH / 2);
  ctx.fill();
}

function drawBasicCoin() {
  ctx.fillStyle = 'rgb(255, 196, 20)';
  ctx.beginPath();
  ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI, false);
  ctx.fill();
}

function drawBasicEnemy() {
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.rect(this.posX - this.sideLength / 2,
           this.posY - this.sideLength / 2,
           this.sideLength,
           this.sideLength);
}

function drawBasicBarrier() {
  ctx.fillStyle = 'rgb(0, 170, 0)';
  ctx.rect(WIDTH / 2 - 3, this.topHeight, 6, this.length); 
}

// Movement Methods

function moveShip(step) {
  // TODO: Account for collisions
  this.posX += step;
}
