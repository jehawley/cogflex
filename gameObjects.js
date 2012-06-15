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

}

function drawBasicEnemy() {

}

function drawBasicBarrier() {

}
