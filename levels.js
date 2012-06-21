// levels.js
// Contains methods for building and managing levels

// 0 for left = good, 1 for right = good
var testSide = [];

var objectQueue = [];
var levelSides = [];
var player = new Ship(WIDTH / 2, drawBasicShip);

function buildLevel1() {
  initTestValues(1, [1.0], [10]);
  objectQueue[500] = [];
  objectQueue[500].push(new Coin(100, 515, 15, drawBasicCoin));
  objectQueue[500].push(new Enemy(200, 510, 20, drawBasicEnemy));
  objectQueue[500].push(new Powerup(300, 510, 20, drawBasicPowerup));
  objectQueue[500].push(new Barrier(500, 300, drawBasicBarrier));
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
