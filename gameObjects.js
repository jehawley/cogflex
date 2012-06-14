// gameObjects.js
// Contains Game Object prototype and all game objects

function GameObject(topHeight, posX, posY, drawFun, type) {
  this.topHeight = topHeight || 0;
  this.posX = posX || 0;
  this.posY = posY || 0;
  this.draw = drawFun;
  // "Intersection types are: BB, AABB, Circle, Ellipse, None
  this.intersectionType = type || "None";
};

function Ship(posX, posY) {
  this.base = GameObject;
  this.base(OFFSET, posX, posY, drawFun, "BB");
};
Ship.prototype = new GameObject;

function Coin(centerX, centerY, radius, drawFun) {
  this.base = GameObject;
  this.base(posY - radius, centerX, centerY, drawFun, 'Circle');
  this.radius = radius;
};
Coin.prototype = new GameObject;

function Enemy(centerX, centerY, sideLength, drawFun) {
  this.base = GameObject;
  this.base(posY - sideLength / 2, centerX, centerY, drawFun, 'AABB');
  this.sideLength = sideLength;
};
Enemy.prototype = new GameObject;

function Barrier(topHeight, drawFun, length, drawFun) {
  this.base = GameObject;
  this.base(topHeight, WIDTH / 2, topHeight, drawFun, 'AABB');
  this.length = length;
};
Barrier.prototype = new GameObject;
