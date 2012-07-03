// levels.js
// Contains methods for building and managing levels

// 0 for left = good, 1 for right = good
var testSide = [];
// Holds arrays of game objects indexed by object top
var objectQueue = [];
// Indexed by y coordinate, contains {x, next}
var levelSides = [];
// The old index whose next value needs setting
var nextInd;

var levelEnd;
var player = new Ship(WIDTH / 2, drawBasicShip);


function buildLevel1() {
  var i;
  var sep1 = 300, sep2 = 600;
  initTestValues(4, [1.0, 0.0, 0.8, 0.2], [20, 20, 20, 20]);
  var waveSequence = [];
  var jitter = [];
  var totalJitter = 0;
  var tsSlice = testSide.slice(0, 80);
  testSide = testSide.slice(80);

  for (i = 0; i < LEVEL_LENGTH; ++i) {
    jitter.push(Math.random() * 30);
  }

  if (tsSlice.length < 80) {
    // TODO: Fill with end-of-level filler
  }

  levelSides[0] = { x: SIDE_WIDTH, next: undefined };
  nextInd = 0;

  for (i = 1; i <= LEVEL_LENGTH; ++i) {
    
  }

//  levelSides[sep * (testSide.length + 1) + 110] =
//    { x: SIDE_WIDTH, next: undefined };
//  levelEnd = levelSides.length + 200;
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


// Waves
// Each wave takes (x, y) coordinates of the upper-left corner
// of the lowest object. Each wave has a width and a length.

var waves = [];

// Width = 200, Length = 20
waves[0] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawBasicEnemy));
};

// Width = 200, Length = 20
waves[1] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawBasicCoin));
};

// Width = 290, Length = 200
waves[2] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+75, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+205, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+270, y+10, 20, drawBasicEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Coin(x+75, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Coin(x+140, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Enemy(x+205, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(x+270, y+70, 20, drawBasicEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawBasicEnemy));
  objectQueue[y+120].push(new Enemy(x+75, y+130, 20, drawBasicEnemy));
  objectQueue[y+120].push(new Coin(x+140, y+130, 10, drawBasicCoin));
  objectQueue[y+120].push(new Coin(x+205, y+130, 10, drawBasicCoin));
  objectQueue[y+120].push(new Enemy(x+270, y+130, 20, drawBasicEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Enemy(x+10, y+190, 20, drawBasicEnemy));
  objectQueue[y+180].push(new Enemy(x+75, y+190, 20, drawBasicEnemy));
  objectQueue[y+180].push(new Enemy(x+140, y+190, 20, drawBasicEnemy));
  objectQueue[y+180].push(new Coin(x+205, y+190, 10, drawBasicCoin));
  objectQueue[y+180].push(new Coin(x+270, y+190, 10, drawBasicCoin));
};

// Width = 290, Length = 200
waves[3] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Coin(x+205, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+270, y+10, 10, drawBasicCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(x+75, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Coin(x+140, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Coin(x+205, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Enemy(x+270, y+70, 20, drawBasicEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawBasicEnemy));
  objectQueue[y+120].push(new Coin(x+75, y+130, 10, drawBasicCoin));
  objectQueue[y+120].push(new Coin(x+140, y+130, 10, drawBasicCoin));
  objectQueue[y+120].push(new Enemy(x+205, y+130, 20, drawBasicEnemy));
  objectQueue[y+120].push(new Enemy(x+270, y+130, 20, drawBasicEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Coin(x+10, y+190, 10, drawBasicCoin));
  objectQueue[y+180].push(new Coin(x+75, y+190, 10, drawBasicCoin));
  objectQueue[y+180].push(new Enemy(x+140, y+190, 20, drawBasicEnemy));
  objectQueue[y+180].push(new Enemy(x+205, y+190, 20, drawBasicEnemy));
  objectQueue[y+180].push(new Enemy(x+270, y+190, 20, drawBasicEnemy));
};

// Width = 290, Length = 170
waves[4] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+75, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+205, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+270, y+10, 20, drawBasicEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+10, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(x+75, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(x+140, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Enemy(x+205, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(x+270, y+60, 20, drawBasicEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+10, y+110, 20, drawBasicEnemy));
  objectQueue[y+100].push(new Enemy(x+75, y+110, 20, drawBasicEnemy));
  objectQueue[y+100].push(new Coin(x+140, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Coin(x+205, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Enemy(x+270, y+110, 20, drawBasicEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+10, y+160, 20, drawBasicEnemy));
  objectQueue[y+150].push(new Enemy(x+75, y+160, 20, drawBasicEnemy));
  objectQueue[y+150].push(new Enemy(x+140, y+160, 20, drawBasicEnemy));
  objectQueue[y+150].push(new Coin(x+205, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Coin(x+270, y+160, 10, drawBasicCoin));
};

// Width = 290, Length = 170
waves[5] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Coin(x+205, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+270, y+10, 10, drawBasicCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+10, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(x+75, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(x+140, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(x+205, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Enemy(x+270, y+60, 20, drawBasicEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+10, y+110, 20, drawBasicEnemy));
  objectQueue[y+100].push(new Coin(x+75, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Coin(x+140, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Enemy(x+205, y+110, 20, drawBasicEnemy));
  objectQueue[y+100].push(new Enemy(x+270, y+110, 20, drawBasicEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Coin(x+10, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Coin(x+75, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Enemy(x+140, y+160, 20, drawBasicEnemy));
  objectQueue[y+150].push(new Enemy(x+205, y+160, 20, drawBasicEnemy));
  objectQueue[y+150].push(new Enemy(x+270, y+160, 20, drawBasicEnemy));
};

// Width = 320, Length = 20
waves[6] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Coin(x+250, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+310, y+10, 10, drawBasicCoin));
};

// Width = 320, Length = 20
waves[7] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Enemy(x+250, y+10, 10, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+310, y+10, 10, drawBasicEnemy));
};

// Width = 260, Length = 200
waves[8] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawBasicCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+70, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Coin(x+130, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Enemy(x+190, y+70, 20, drawBasicEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawBasicEnemy));
  objectQueue[y+120].push(new Coin(x+70, y+130, 10, drawBasicCoin));
  objectQueue[y+120].push(new Enemy(x+130, y+130, 20, drawBasicEnemy));
  objectQueue[y+120].push(new Coin(x+190, y+130, 10, drawBasicCoin));
  objectQueue[y+120].push(new Enemy(x+250, y+130, 20, drawBasicEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Coin(x+10, y+190, 10, drawBasicCoin));
  objectQueue[y+180].push(new Enemy(x+130, y+190, 20, drawBasicEnemy));
  objectQueue[y+180].push(new Coin(x+250, y+190, 10, drawBasicCoin));
};

// Width = 260, Length = 260
waves[9] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawBasicCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+70, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(x+130, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Enemy(x+190, y+60, 20, drawBasicEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+10, y+110, 20, drawBasicEnemy));
  objectQueue[y+100].push(new Coin(x+70, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Coin(x+190, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Enemy(x+250, y+110, 20, drawBasicEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+70, y+160, 20, drawBasicEnemy));
  objectQueue[y+150].push(new Coin(x+130, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Enemy(x+190, y+160, 20, drawBasicEnemy));

  objectQueue[y+200] = [];
  objectQueue[y+200].push(new Enemy(x+130, y+210, 20, drawBasicEnemy));
};

// Width = 380, Length = 320
waves[10] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawBasicCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+130, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(x+190, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Enemy(x+250, y+60, 20, drawBasicEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+70, y+110, 20, drawBasicEnemy));
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Coin(x+190, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Coin(x+250, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Enemy(x+310, y+110, 20, drawBasicEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+10, y+160, 20, drawBasicEnemy));
  objectQueue[y+150].push(new Coin(x+70, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Coin(x+130, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Coin(x+190, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Coin(x+250, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Coin(x+310, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Enemy(x+370, y+160, 20, drawBasicEnemy));

  objectQueue[y+200] = [];
  objectQueue[y+200].push(new Enemy(x+70, y+210, 20, drawBasicEnemy));
  objectQueue[y+200].push(new Coin(x+130, y+210, 10, drawBasicCoin));
  objectQueue[y+200].push(new Coin(x+190, y+210, 10, drawBasicCoin));
  objectQueue[y+200].push(new Coin(x+250, y+210, 10, drawBasicCoin));
  objectQueue[y+200].push(new Enemy(x+310, y+210, 20, drawBasicEnemy));

  objectQueue[y+250] = [];
  objectQueue[y+250].push(new Enemy(x+130, y+260, 20, drawBasicEnemy));
  objectQueue[y+250].push(new Coin(x+190, y+260, 10, drawBasicCoin));
  objectQueue[y+250].push(new Enemy(x+250, y+260, 20, drawBasicEnemy));

  objectQueue[y+300] = [];
  objectQueue[y+300].push(new Enemy(x+190, y+310, 20, drawBasicEnemy));
};

// Width = 380, Length = 320
waves[11] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawBasicCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+130, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(x+190, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Enemy(x+250, y+60, 20, drawBasicEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+70, y+110, 20, drawBasicEnemy));
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Coin(x+190, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Coin(x+250, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Enemy(x+310, y+110, 20, drawBasicEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+10, y+160, 20, drawBasicEnemy));
  objectQueue[y+150].push(new Powerup(x+70, y+160, 20, drawBasicPowerup));
  objectQueue[y+150].push(new Coin(x+130, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Coin(x+190, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Coin(x+250, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Coin(x+310, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Enemy(x+370, y+160, 20, drawBasicEnemy));

  objectQueue[y+200] = [];
  objectQueue[y+200].push(new Enemy(x+70, y+210, 20, drawBasicEnemy));
  objectQueue[y+200].push(new Coin(x+130, y+210, 10, drawBasicCoin));
  objectQueue[y+200].push(new Coin(x+190, y+210, 10, drawBasicCoin));
  objectQueue[y+200].push(new Coin(x+250, y+210, 10, drawBasicCoin));
  objectQueue[y+200].push(new Enemy(x+310, y+210, 20, drawBasicEnemy));

  objectQueue[y+250] = [];
  objectQueue[y+250].push(new Enemy(x+130, y+260, 20, drawBasicEnemy));
  objectQueue[y+250].push(new Coin(x+190, y+260, 10, drawBasicCoin));
  objectQueue[y+250].push(new Enemy(x+250, y+260, 20, drawBasicEnemy));

  objectQueue[y+300] = [];
  objectQueue[y+300].push(new Enemy(x+190, y+310, 20, drawBasicEnemy));
};

// Width = 380, Length = 320
waves[12] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawBasicCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+130, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(x+190, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Enemy(x+250, y+60, 20, drawBasicEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+70, y+110, 20, drawBasicEnemy));
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Coin(x+190, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Coin(x+250, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Enemy(x+310, y+110, 20, drawBasicEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+10, y+160, 20, drawBasicEnemy));
  objectQueue[y+150].push(new Coin(x+70, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Coin(x+130, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Coin(x+190, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Coin(x+250, y+160, 10, drawBasicCoin));
  objectQueue[y+150].push(new Powerup(x+310, y+160, 20, drawBasicPowerup));
  objectQueue[y+150].push(new Enemy(x+370, y+160, 20, drawBasicEnemy));

  objectQueue[y+200] = [];
  objectQueue[y+200].push(new Enemy(x+70, y+210, 20, drawBasicEnemy));
  objectQueue[y+200].push(new Coin(x+130, y+210, 10, drawBasicCoin));
  objectQueue[y+200].push(new Coin(x+190, y+210, 10, drawBasicCoin));
  objectQueue[y+200].push(new Coin(x+250, y+210, 10, drawBasicCoin));
  objectQueue[y+200].push(new Enemy(x+310, y+210, 20, drawBasicEnemy));

  objectQueue[y+250] = [];
  objectQueue[y+250].push(new Enemy(x+130, y+260, 20, drawBasicEnemy));
  objectQueue[y+250].push(new Coin(x+190, y+260, 10, drawBasicCoin));
  objectQueue[y+250].push(new Enemy(x+250, y+260, 20, drawBasicEnemy));

  objectQueue[y+300] = [];
  objectQueue[y+300].push(new Enemy(x+190, y+310, 20, drawBasicEnemy));
};

// Width = 380, Length = 80
waves[13] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Coin(x+310, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+370, y+10, 10, drawBasicCoin));
  
  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(x+70, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(x+130, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Coin(x+190, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Coin(x+250, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Enemy(x+310, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(x+370, y+70, 20, drawBasicEnemy));
};

// Width = 380, Length = 80
waves[14] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Coin(x+310, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+370, y+10, 10, drawBasicCoin));
  
  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(x+70, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(x+130, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Coin(x+190, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Coin(x+250, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Enemy(x+310, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Powerup(x+370, y+70, 20, drawBasicPowerup));
};

// Width = 200, Length = 60
waves[15] = function (x, y) {
  waves[0](x, y);
  waves[0](x, y+40);
};

// Width = 200, Length = 60
waves[16] = function (x, y) {
  waves[1](x, y);
  waves[1](x, y+50);
};

// Barrier Waves
// Each wave takes a y coordinate of the top of the barrier
// Each wave has a length, which is the length of the barrier
var barWaves = [];

// Length = 100
barWaves[0] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBasicBarrier));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(100, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Coin(150, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Coin(200, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Enemy(300, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(350, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(400, y+70, 20, drawBasicEnemy));
};

// Length = 100
barWaves[1] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBasicBarrier));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(100, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(150, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(200, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Coin(300, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Coin(350, y+70, 20, drawBasicCoin));
  objectQueue[y+60].push(new Coin(400, y+70, 10, drawBasicCoin));
};

// Length = 100
barWaves[2] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBasicBarrier));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(100, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Powerup(150, y+70, 20, drawBasicPowerup));
  objectQueue[y+60].push(new Coin(200, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Enemy(300, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(350, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(400, y+70, 20, drawBasicEnemy));
};

// Length = 100
barWaves[3] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBasicBarrier));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(100, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(150, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Enemy(200, y+70, 20, drawBasicEnemy));
  objectQueue[y+60].push(new Coin(300, y+70, 10, drawBasicCoin));
  objectQueue[y+60].push(new Powerup(350, y+70, 20, drawBasicPowerup));
  objectQueue[y+60].push(new Coin(400, y+70, 10, drawBasicCoin));
};

// Length = 120
barWaves[4] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 120, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(150, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Enemy(350, y+60, 20, drawBasicEnemy));

  objectQueue[y+80] = [];
  objectQueue[y+80].push(new Coin(110, y+90, 10, drawBasicCoin));
  objectQueue[y+80].push(new Coin(190, y+90, 10, drawBasicCoin));
  objectQueue[y+80].push(new Enemy(310, y+90, 20, drawBasicEnemy));
  objectQueue[y+80].push(new Enemy(390, y+90, 20, drawBasicEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(150, y+110, 10, drawBasicCoin));
  objectQueue[y+100].push(new Enemy(350, y+110, 20, drawBasicEnemy));
};

// Length = 120
barWaves[5] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 120, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(150, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(350, y+60, 10, drawBasicCoin));

  objectQueue[y+80] = [];
  objectQueue[y+80].push(new Enemy(110, y+90, 20, drawBasicEnemy));
  objectQueue[y+80].push(new Enemy(190, y+90, 20, drawBasicEnemy));
  objectQueue[y+80].push(new Coin(310, y+90, 10, drawBasicCoin));
  objectQueue[y+80].push(new Coin(390, y+90, 10, drawBasicCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(150, y+110, 20, drawBasicEnemy));
  objectQueue[y+100].push(new Coin(350, y+110, 10, drawBasicCoin));
};

// Length = 80
barWaves[6] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(100, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(150, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(200, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Enemy(300, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(350, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(400, y+60, 20, drawBasicEnemy));
};

// Length = 80
barWaves[7] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(100, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(150, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(200, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(300, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(350, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(400, y+60, 10, drawBasicCoin));
};

// Length = 80
barWaves[8] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(100, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Powerup(150, y+60, 20, drawBasicPowerup));
  objectQueue[y+50].push(new Coin(200, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Enemy(300, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(350, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(400, y+60, 20, drawBasicEnemy));
};

// Length = 80
barWaves[9] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(100, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(150, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(200, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(300, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Powerup(350, y+60, 20, drawBasicPowerup));
  objectQueue[y+50].push(new Coin(400, y+60, 10, drawBasicCoin));
};

// Length = 80
barWaves[10] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Powerup(100, y+60, 20, drawBasicPowerup));
  objectQueue[y+50].push(new Coin(150, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(200, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Enemy(300, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(350, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(400, y+60, 20, drawBasicEnemy));
};

// Length = 80
barWaves[11] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(100, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(150, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(200, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(300, y+60, 10, drawBasicPowerup));
  objectQueue[y+50].push(new Coin(350, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(400, y+60, 10, drawBasicCoin));
};

// Length = 80
barWaves[12] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(100, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(150, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Powerup(200, y+60, 20, drawBasicPowerup));
  objectQueue[y+50].push(new Enemy(300, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(350, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(400, y+60, 20, drawBasicEnemy));
};

// Length = 80
barWaves[13] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(100, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(150, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(200, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(300, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(350, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Powerup(400, y+60, 20, drawBasicPowerup));
};

function narrowSides(y) {
  levelSides[nextInd].next = y;
  levelSides[y] = { x: SIDE_WIDTH, next: y + 20 };
  levelSides[y + 20] = { x: WIDTH/2-SHIP_WIDTH/2-1, next: y + 40 };
  levelSides[y + 40] = { x: SIDE_WIDTH, next: undefined };
  nextInd = y + 40;
}
