// levels.js
// Contains methods for building and managing levels

// 0 for left = good, 1 for right = good
var testSide = [];
// Holds arrays of game objects indexed by object top
var objectQueue = [];
// Indexed by y coordinate, contains {x, next}
var levelSides = [];
var levelEnd = 11*400 + 200;
var player = new Ship(WIDTH / 2, drawBasicShip);

function buildLevel1() {
  var i, sep = 400, sep2, sep3;
  initTestValues(2, [1.0, 0.0], [10, 10]);
  for (i = 1; i < 11; ++i) {
    objectQueue[sep*i] = [];
    objectQueue[sep*i].push(new Coin(80, sep*i+10, 10, drawBasicCoin));
    objectQueue[sep*i].push(new Coin(140, sep*i+10, 10, drawBasicCoin));
    objectQueue[sep*i].push(new Coin(200, sep*i+10, 10, drawBasicCoin));
    objectQueue[sep*i].push(new Enemy(260, sep*i+10, 20, drawBasicEnemy));
    objectQueue[sep*i].push(new Enemy(320, sep*i+10, 20, drawBasicEnemy));
    objectQueue[sep*i].push(new Coin(380, sep*i+10, 10, drawBasicCoin));
    objectQueue[sep*i].push(new Coin(440, sep*i+10, 10, drawBasicCoin));
    sep2 = sep*i + 60;
    objectQueue[sep2] = [];
    objectQueue[sep2].push(new Enemy(80, sep2+10, 20, drawBasicEnemy));
    objectQueue[sep2].push(new Enemy(140, sep2+10, 20, drawBasicEnemy));
    objectQueue[sep2].push(new Enemy(200, sep2+10, 20, drawBasicEnemy));
    objectQueue[sep2].push(new Coin(260, sep2+10, 10, drawBasicCoin));
    objectQueue[sep2].push(new Coin(320, sep2+10, 10, drawBasicCoin));
    objectQueue[sep2].push(new Enemy(380, sep2+10, 20, drawBasicEnemy));
    objectQueue[sep*i].push(new Enemy(440, sep2+10, 20, drawBasicEnemy));
    objectQueue[sep2+120] = [];
    objectQueue[sep2+120].push(new Barrier(sep2+120, 100, drawBasicBarrier));
    sep3 = sep2+180;
    objectQueue[sep3] = [];
    objectQueue[sep3].push(new Coin(100, sep3+10, 10, drawBasicCoin));
    objectQueue[sep3].push(new Powerup(150, sep3+10, 20, drawBasicPowerup));
    objectQueue[sep3].push(new Coin(200, sep3+10, 10, drawBasicCoin));
    objectQueue[sep3].push(new Enemy(300, sep3+10, 20, drawBasicEnemy));
    objectQueue[sep3].push(new Enemy(350, sep3+10, 20, drawBasicEnemy));
    objectQueue[sep3].push(new Enemy(400, sep3+10, 20, drawBasicEnemy));
  }

  levelSides[0] = { x: SIDE_WIDTH, next: 510 };
  levelSides[510] = { x: SIDE_WIDTH, next: 530 };
  levelSides[530] = { x: WIDTH / 2 - SHIP_WIDTH / 2 - 1, next: 550 };
  levelSides[550] = { x: SIDE_WIDTH, next: 910 };
  levelSides[910] = { x: SIDE_WIDTH, next: 930 };
  levelSides[930] = { x: WIDTH / 2 - SHIP_WIDTH / 2 - 1, next: 950 };
  levelSides[950] = { x: SIDE_WIDTH, next: 1000 };
  levelSides[1000] = { x: SIDE_WIDTH, next: 1310 };
  levelSides[1310] = { x: SIDE_WIDTH, next: 1330 };
  levelSides[1330] = { x: WIDTH / 2 - SHIP_WIDTH / 2 - 1, next: 1350 };
  levelSides[1350] = { x: SIDE_WIDTH, next: 2000 };
  levelSides[2000] = { x: SIDE_WIDTH, next: 2100 };
  levelSides[2100] = { x: SIDE_WIDTH, next: 2200 };
  levelSides[2200] = { x: SIDE_WIDTH+15, next: 2300 };
  levelSides[2300] = { x: SIDE_WIDTH, next: 3000 };
  levelSides[3000] = { x: SIDE_WIDTH, next: 4000 };
  levelSides[4000] = { x: SIDE_WIDTH, next: undefined };
}

// splits: The number of probability regions
// success: The probability of success in each region
// trials: The number of trials in each region
function initTestValues(splits, success, trials) {
  var i;
  var j;
  // TODO: Randomly choose a side
  var side = 0;
  var oldLen = 0;
  for (i = 0; i < splits; ++i) {
    oldLen = testSide.length;
    for (j = 0; j < trials[i]; ++j) {
      if (j < success[i] * trials[i]) {
        testSide.push(side);
      } else {
        testSide.push(1 - side);
      }
    }
    // TODO: randomly shuffle newly added elements here (Knuth shuffle)
  }
}
