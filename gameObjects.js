// gameObjects.js
// Contains Game Object prototype and all game objects

function GameObject(topHeight, bottomHeight,
                    posX, posY,
                    drawFun, intersectFun) {
  this.topHeight = topHeight || 0;
  this.bottomHeight = bottomHeight || 0;
  this.posX = posX || 0;
  this.posY = posY || 0;
  this.draw = drawFun;
  this.intersect = intersectFun;
}

function Ship(posX, drawFun) {
  this.base = GameObject;
  this.base(OFFSET, OFFSET + SHIP_WIDTH / 2,
            posX, OFFSET,
            drawFun, function () { return false; });
  this.move = moveShip;
  this.speed = SHIP_DESCENT;
  this.canMove = true;
  this.barrier = undefined;
}
Ship.prototype = new GameObject;

function Coin(centerX, centerY, radius, drawFun) {
  this.base = GameObject;
  this.base(centerY - radius, centerY + radius,
            centerX, centerY,
            drawFun, shipCoinTest);
  this.radius = radius;
}
Coin.prototype = new GameObject;

function Enemy(centerX, centerY, sideLength, drawFun) {
  this.base = GameObject;
  this.base(centerY - sideLength / 2, centerY + sideLength / 2,
            centerX, centerY,
            drawFun, shipEnemyTest);
  this.sideLength = sideLength;
}
Enemy.prototype = new GameObject;

function Powerup(centerX, centerY, width, drawFun) {
  this.base = GameObject;
  this.base(centerY - width / 2, centerY + width / 2,
            centerX, centerY,
            drawFun, shipPowerupTest);
  this.width = width;
}
Powerup.prototype = new GameObject;

function Barrier(topHeight, length, drawFun) {
  this.base = GameObject;
  this.base(topHeight, topHeight + length,
            WIDTH / 2, topHeight,
            drawFun, shipBarrierTest);
  this.length = length;
}
Barrier.prototype = new GameObject;

function moveShip(step) {
  // TODO: Account for collisions against world
  this.posX += step;
}

// Collision Tests

// A circle vs. right triangle test
function shipCoinTest() {
  var lowS, lowC, highS, highC;

  // y axis
  lowS = player.posY
  highS = player.posY + SHIP_WIDTH / 2;
  lowC = this.posY - this.radius;
  highC = this.posY + this.radius;

  if ((highS < lowC) || (highC < lowS)) {
    return false;
  }

  // y = x axis
  lowS = player.posX - SHIP_WIDTH / 2 + player.posY;
  highS = player.posX + SHIP_WIDTH / 2 + player.posY;
  lowC = this.posX + this.posY - this.radius;
  highC = this.posX + this.posY + this.radius;

  if ((highS < lowC) || (highC < lowS)) {
    return false;
  }

  // y = -x axis
  lowS = player.posX - SHIP_WIDTH / 2 - player.posY;
  highS = player.posX + SHIP_WIDTH / 2 - player.posY;
  lowC = this.posX - this.posY - this.radius;
  highC = this.posX - this.posY + this.radius;
 
  if ((highS < lowC) || (highC < lowS)) {
    return false;
  }

  return true;
}

// An AABB vs. right triangle test
function shipEnemyTest() {
  var lowS, lowE, highS, highE;
  
  // x axis
  lowS = player.posX - SHIP_WIDTH / 2;
  highS = player.posX + SHIP_WIDTH / 2;
  lowE = this.posX - this.sideLength / 2;
  highE = this.posX + this.sideLength / 2;

  if ((highS < lowE) || (highE < lowS)) {
    return false;
  }

  // y axis
  lowS = player.posY;
  highS = player.posY + SHIP_WIDTH / 2;
  lowE = this.posY - this.sideLength / 2;
  highE = this.posY + this.sideLength / 2;

  if ((highS < lowE) || (highE < lowS)) {
    return false;
  }
  // y = x axis

  lowS = player.posX - SHIP_WIDTH / 2 + player.posY;
  highS = player.posX + SHIP_WIDTH / 2 + player.posY;
  lowE = this.posX + this.posY - this.sideLength;
  highE = this.posX + this.posY + this.sideLength;

 if ((highS < lowE) || (highE < lowS)) {
    return false;
  }

  // y = -x axis
  lowS = player.posX - SHIP_WIDTH / 2 - player.posY;
  highS = player.posX + SHIP_WIDTH / 2 - player.posY;
  lowE = this.posX - this.posY - this.sideLength;
  highE = this.posX - this.posY + this.sideLength;

  if ((highS < lowE) || (highE < lowS)) {
    return false;
  }

  return true;
}

// A parallel BB vs. right triangle test
function shipPowerupTest() {
  var lowS, lowP, highS, highP;
  
  // y = x axis
  lowS = player.posX - SHIP_WIDTH / 2 + player.posY;
  highS = player.posX + SHIP_WIDTH / 2 + player.posY;
  lowP = this.posX - this.width / 2 + this.posY;
  highP = this.posX + this.width / 2 + this.posY;

  if ((highP < lowS) || (highS < lowP)) {
    return false;
  }

  // y = -x axis 
  lowS = player.posX - SHIP_WIDTH / 2 - player.posY;
  highS = player.posX + SHIP_WIDTH / 2 - player.posY;
  lowP = this.posX - this.width / 2 - this.posY;
  highP = this.posX + this.width / 2 - this.posY;

  if ((highP < lowS) || (highS < lowP)) {
    return false;
  }

  return true;
}

// An AABB vs. right triangle test
function shipBarrierTest() { 
  var lowS, lowB, highS, highB;
  // x axis 
  lowS = player.posX - SHIP_WIDTH / 2;
  highS = player.posX + SHIP_WIDTH / 2;
  lowB = this.posX - BAR_WIDTH / 2;
  highB = this.posX + BAR_WIDTH / 2;

  if ((lowB > highS) || (lowS > highB)) {
    return false;
  }

  // y axis
  lowS = player.posY;
  highS = player.posY + SHIP_WIDTH / 2;
  lowB = this.posY;
  highB = this.posY + this.length;

  if ((lowB > highS) || (lowS > highB)) {
    return false;
  }

  // y = x axis
  lowS = player.posX - SHIP_WIDTH / 2 + player.posY;
  highS = player.posX + SHIP_WIDTH / 2 + player.posY;
  lowB = this.posX - BAR_WIDTH / 2 + this.posY;
  highB = this.posX + BAR_WIDTH / 2 + this.posY + this.length;

  if ((lowB > highS) || (lowS > highB)) {
    return false;
  }

  // y = -x axis
  lowS = player.posX - SHIP_WIDTH / 2 - player.posY;
  highS = player.posX + SHIP_WIDTH / 2 - player.posY;
  lowB = this.posX - BAR_WIDTH / 2 - this.posY - this.length;
  highB = this.posX + BAR_WIDTH / 2 - this.posY;

  if ((lowB > highS) || (lowS > highB)) {
    return false;
  }

  return true;
}
