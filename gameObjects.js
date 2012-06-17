// gameObjects.js
// Contains Game Object prototype and all game objects

function GameObject(topHeight, posX, posY, drawFun, type) {
  this.topHeight = topHeight || 0;
  this.posX = posX || 0;
  this.posY = posY || 0;
  this.draw = drawFun;
  // "Intersection types are: Composite, BB, AABB, Circle, Ellipse, None
  this.intersectionType = type || 'None';
}

function Ship(posX, drawFun) {
  this.base = GameObject;
  this.base(OFFSET, posX, OFFSET, drawFun, 'Composite');
  this.move = moveShip;
  this.speed = SHIP_DESCENT;
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
  this.base(centerY - sideLength / 2, centerX, centerY, drawFun, 'AABB');
  this.sideLength = sideLength;
}
Enemy.prototype = new GameObject;

function Powerup(centerX, centerY, width, drawFun) {
  this.base = GameObject;
  this.base(centerY - width / 2, centerX, centerY, drawFun, 'BB');
  this.width = width;
}
Powerup.prototype = new GameObject;

function Barrier(topHeight, length, drawFun) {
  this.base = GameObject;
  this.base(topHeight, WIDTH / 2, topHeight, drawFun, 'AABB');
  this.length = length;
}
Barrier.prototype = new GameObject;

// Movement Methods

function moveShip(step) {
  // TODO: Account for collisions
  this.posX += step;
}
