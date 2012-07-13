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
  var L1_LENGTH = 60;
  var i, j;
  var temp;
  // Each object has parameters w (array of wave ids),
  // wa (arguments to wave functions), and b (array of barWave ids)
  var waveSeq = [];
  var tsSlice = testSide.slice(0, L1_LENGTH);
  testSide = testSide.slice(L1_LENGTH);
  // Initialized to starting delay
  var accum = OFFSET + 300;
  var random = Alea();

  for (i = tsSlice.length; i < L1_LENGTH; ++i) {
    tsSlice.push(-1);
  }

  levelSides[0] = { x: SIDE_WIDTH, next: undefined };
  nextInd = 0;

  buildLevel1Waves(waveSeq);

  for (i = 0; i < L1_LENGTH; ++i) {
    for (j = 0; j < waveSeq[i].w.length; ++j) {
      waves[waveSeq[i].w[j]](waveSeq[i].wa[j], accum);
      accum += (waves[waveSeq[i].w[j]].height +
                Math.floor(random() * 40) + 60);
    }

    accum += 30;

    if (tsSlice[i] > -1) {
      narrowSides(accum);
      accum += 100;
      barWaves[waveSeq[i].b + tsSlice[i] + 2 * Math.round(random())](accum);
      accum += (barWaves[waveSeq[i].b].height +
                Math.floor(random() * 20) + 150);
    } else {
      accum += 30;
      waves[17](60, accum);
      accum += waves[17].height;
    }
  }
  levelSides[accum + HEIGHT + 50] =
    { x: SIDE_WIDTH, next: undefined };
  levelSides[nextInd].next = accum + HEIGHT + 50;
  levelEnd = levelSides.length - HEIGHT;
}

function buildTestWaves(waveSeq) {
  var i = 0;
  for (i = 0; i < 60; ++i) {
    waveSeq[i] = { w: [3], wa: [60], b: 6 };
  }
}

function buildLevel1Waves(waveSeq) {
  waveSeq[0] = { w: [15], wa: [80], b: 14 };
  waveSeq[1] = { w: [15], wa: [220], b: 14 };
  waveSeq[2] = { w: [15], wa: [150], b: 14 };
  waveSeq[3] = { w: [15], wa: [150], b: 14 };
  waveSeq[4] = { w: [16], wa: [80], b: 14 };
  waveSeq[5] = { w: [16], wa: [220], b: 14 };
  waveSeq[6] = { w: [16], wa: [150], b: 14 };
  waveSeq[7] = { w: [16], wa: [80], b: 14 };
  waveSeq[8] = { w: [16], wa: [220], b: 14 };
  shuffleArray(waveSeq, 0, 9);  

  waveSeq[9] = { w: [17], wa: [120], b: 14 };
  waveSeq[10] = { w: [17], wa: [180], b: 14 };
  waveSeq[11] = { w: [18], wa: [120], b: 14 };
  waveSeq[12] = { w: [18], wa: [120], b: 14 };
  shuffleArray(waveSeq, 7, 13);

  waveSeq[13] = { w: [13], wa: [60], b: 14 };
  waveSeq[14] = { w: [14], wa: [60], b: 14 };
  waveSeq[15] = { w: [13], wa: [60], b: 14 };
  shuffleArray(waveSeq, 12, 16);

  waveSeq[16] = { w: [17, 15], wa: [70, 180], b: 14 };
  waveSeq[17] = { w: [17, 16], wa: [70, 180], b: 14 };
  waveSeq[18] = { w: [17, 15], wa: [180, 70], b: 14 };
  waveSeq[19] = { w: [18, 16], wa: [70, 180], b: 14 };
  waveSeq[20] = { w: [18, 15], wa: [70, 180], b: 14 };
  waveSeq[21] = { w: [18, 16], wa: [180, 70], b: 14 };
  shuffleArray(waveSeq, 15, 22);

  waveSeq[22] = { w: [6, 7], wa: [60, 60], b: 14 };
  waveSeq[23] = { w: [6, 7], wa: [60, 60], b: 14 };
  waveSeq[24] = { w: [7, 6], wa: [60, 60], b: 14 };
  waveSeq[25] = { w: [7, 7], wa: [60, 60], b: 14 };
  waveSeq[26] = { w: [7, 6], wa: [60, 60], b: 14 };
  waveSeq[27] = { w: [6, 6], wa: [60, 60], b: 14 };
  shuffleArray(waveSeq, 21, 28);

  waveSeq[28] = { w: [13, 0, 1], wa: [60, 60, 180], b: 14 };
  waveSeq[29] = { w: [13, 1, 0], wa: [60, 60, 180], b: 14 };
  waveSeq[30] = { w: [13, 0, 1], wa: [60, 100, 180], b: 14 };
  waveSeq[31] = { w: [13, 1, 0], wa: [60, 100, 180], b: 14 };
  waveSeq[32] = { w: [13, 0, 1], wa: [60, 100, 60], b: 14 };
  waveSeq[33] = { w: [13, 1, 0], wa: [60, 100, 60], b: 14 };
  waveSeq[34] = { w: [13, 0, 1], wa: [60, 180, 180], b: 14 };
  waveSeq[35] = { w: [13, 0, 1, 1], wa: [60, 60, 100, 180], b: 14 };
  waveSeq[36] = { w: [13, 1, 0, 0], wa: [60, 60, 180, 100], b: 14 };
  waveSeq[37] = { w: [13, 0, 1, 0], wa: [60, 180, 60, 100], b: 14 };
  shuffleArray(waveSeq, 28, 38);

  waveSeq[38] = { w: [2], wa: [60], b: 14 };
  waveSeq[39] = { w: [2], wa: [100], b: 14 };
  waveSeq[40] = { w: [19], wa: [60], b: 14 };
  waveSeq[41] = { w: [3], wa: [80], b: 14 };
  waveSeq[42] = { w: [3] , wa: [60], b: 14 };
  waveSeq[43] = { w: [4], wa: [60], b: 14 };
  waveSeq[44] = { w: [5], wa: [100], b: 14 };
  waveSeq[45] = { w: [4], wa: [80], b: 14 };
  waveSeq[46] = { w: [5], wa: [60], b: 14 };
  shuffleArray(waveSeq, 37, 47);

  waveSeq[47] = { w: [2, 0], wa: [70, 100], b: 14 };
  waveSeq[48] = { w: [3, 0], wa: [90, 120], b: 14 };
  waveSeq[49] = { w: [2, 1], wa: [100, 60], b: 14 };
  waveSeq[50] = { w: [3, 1], wa: [100, 80], b: 14 };
  waveSeq[51] = { w: [2, 20], wa: [60, 60], b: 14 };
  waveSeq[52] = { w: [4, 5], wa: [100, 100], b: 14 };
  waveSeq[53] = { w: [3, 2], wa: [60, 60], b: 14 };
  waveSeq[54] = { w: [3, 2], wa: [100, 100], b: 14 };
  waveSeq[55] = { w: [4, 4], wa: [60, 100], b: 14 };
  waveSeq[56] = { w: [3, 3], wa: [100, 60], b: 14 };
  waveSeq[57] = { w: [17, 5], wa: [160, 80], b: 14 };
  waveSeq[58] = { w: [18, 4], wa: [190, 60], b: 14 };
  shuffleArray(waveSeq, 46, 59);  

  waveSeq[59] = { w: [2, 3, 4, 5, 4, 5], wa: [60, 60, 60, 60, 60, 60], b: 14 };
}

// splits: The number of probability regions
// success: The probability of success in each region
// trials: The number of trials in each region
function initTestValues(splits, success, trials) {
  var i, j;
  var random = Alea();
  var side = Math.round(random());
  var oldLen = 0;
  for (i = 0; i < splits; ++i) {
    for (j = 0; j < trials[i]; ++j) {
      if (j < success[i] * trials[i]) {
        testSide.push(side);
      } else {
        testSide.push(1 - side);
      }
    }
    shuffleArray(testSide, oldLen, oldLen + trials[i]);
    oldLen += trials[i];
  }
}


// Waves
// Each wave takes (x, y) coordinates of the upper-left corner
// of the lowest object. Each wave has a width and a height.

var waves = [];

// Width = 200, Height = 20
waves[0] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawBasicEnemy));
};
waves[0].width = 200;
waves[0].height = 20;

// Width = 200, Height = 20
waves[1] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawBasicCoin));
};
waves[1].width = 200;
waves[1].height = 20;

// Width = 290, Height = 200
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
waves[2].width = 290;
waves[2].height = 200;

// Width = 290, Height = 200
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
waves[3].width = 290;
waves[3].height = 200;

// Width = 290, Height = 170
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
waves[4].width = 290;
waves[4].height = 170;

// Width = 290, Height = 170
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
waves[5].width = 290;
waves[5].height = 170;

// Width = 320, Height = 20
waves[6] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Coin(x+250, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+310, y+10, 10, drawBasicCoin));
};
waves[6].width = 320;
waves[6].height = 20;

// Width = 320, Height = 20
waves[7] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawBasicCoin));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawBasicEnemy));
  objectQueue[y].push(new Enemy(x+310, y+10, 20, drawBasicEnemy));
};
waves[7].width = 320;
waves[7].height = 20;

// Width = 260, Height = 200
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
waves[8].width = 260;
waves[8].height = 200;

// Width = 260, Height = 260
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
waves[9].width = 260;
waves[9].height = 260;

// Width = 380, Height = 320
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
waves[10].width = 380;
waves[10].height = 320;

// Width = 380, Height = 320
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
waves[11].width = 380;
waves[11].height = 320;

// Width = 380, Height = 320
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
waves[12].width = 380;
waves[12].height = 320;

// Width = 380, Height = 80
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
waves[13].width = 380;
waves[13].height = 80;

// Width = 380, Height = 80
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
waves[14].width = 380;
waves[14].height = 80;

// Width = 200, Height = 60
waves[15] = function (x, y) {
  waves[0](x, y);
  waves[0](x, y+40);
};
waves[15].width = 200;
waves[15].height = 60;

// Width = 200, Height = 60
waves[16] = function (x, y) {
  waves[1](x, y);
  waves[1](x, y+40);
};
waves[16].width = 200;
waves[16].height = 60;

// Width = 200, Height = 70
waves[17] = function (x, y) {
  waves[0](x, y);
  waves[1](x, y+50);
};
waves[17].width = 200;
waves[17].height = 70;

// Width = 200, Height = 70
waves[18] = function (x, y) {
  waves[1](x, y);
  waves[0](x, y+50);
};
waves[18].width = 200;
waves[18].height = 70;

// Width = 290, Height = 200
waves[19] = function (x, y) {
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
  objectQueue[y+180].push(new Powerup(x+270, y+190, 20, drawBasicPowerup));
};
waves[19].width = 290;
waves[19].height = 200;

// Width = 290, Height = 200
waves[20] = function (x, y) {
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
  objectQueue[y+180].push(new Powerup(x+10, y+190, 20, drawBasicPowerup));
  objectQueue[y+180].push(new Coin(x+75, y+190, 10, drawBasicCoin));
  objectQueue[y+180].push(new Enemy(x+140, y+190, 20, drawBasicEnemy));
  objectQueue[y+180].push(new Enemy(x+205, y+190, 20, drawBasicEnemy));
  objectQueue[y+180].push(new Enemy(x+270, y+190, 20, drawBasicEnemy));
};
waves[20].width = 290;
waves[20].height = 200;

// Barrier Waves
// Each wave takes a y coordinate of the top of the barrier
// Each wave has a height, which is the length of the barrier
var barWaves = [];

// Height = 100
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
barWaves[0].height = 100;

// Height = 100
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
barWaves[1].height = 100;

// Height = 100
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
barWaves[2].height = 100;

// Height = 100
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
barWaves[3].height = 100;

// Height = 120
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
barWaves[4].height = 120;

// Height = 120
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
barWaves[5].height = 120;

// Height = 80
barWaves[6] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(100, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(150, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(200, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Enemy(300, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(350, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(400, y+60, 20, drawBasicEnemy));
};
barWaves[6].height = 80;

// Height = 80
barWaves[7] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(100, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(150, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(200, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(300, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(350, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(400, y+60, 10, drawBasicCoin));
};
barWaves[7].height = 80;

// Height = 80
barWaves[8] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(100, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Powerup(150, y+60, 20, drawBasicPowerup));
  objectQueue[y+50].push(new Coin(200, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Enemy(300, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(350, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(400, y+60, 20, drawBasicEnemy));
};
barWaves[8].height = 80;

// Height = 80
barWaves[9] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(100, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(150, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(200, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(300, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Powerup(350, y+60, 20, drawBasicPowerup));
  objectQueue[y+50].push(new Coin(400, y+60, 10, drawBasicCoin));
};
barWaves[9].height = 80;

// Height = 80
barWaves[10] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Powerup(100, y+60, 20, drawBasicPowerup));
  objectQueue[y+50].push(new Coin(150, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(200, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Enemy(300, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(350, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(400, y+60, 20, drawBasicEnemy));
};
barWaves[10].height = 80;

// Height = 80
barWaves[11] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(100, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(150, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(200, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(300, y+60, 10, drawBasicPowerup));
  objectQueue[y+50].push(new Coin(350, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(400, y+60, 10, drawBasicCoin));
};
barWaves[11].height = 80;

// Height = 80
barWaves[12] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(100, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(150, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Powerup(200, y+60, 20, drawBasicPowerup));
  objectQueue[y+50].push(new Enemy(300, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(350, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(400, y+60, 20, drawBasicEnemy));
};
barWaves[12].height = 80;

// Height = 80
barWaves[13] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBasicBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(100, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(150, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Enemy(200, y+60, 20, drawBasicEnemy));
  objectQueue[y+50].push(new Coin(300, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Coin(350, y+60, 10, drawBasicCoin));
  objectQueue[y+50].push(new Powerup(400, y+60, 20, drawBasicPowerup));
};
barWaves[13].height = 80;

// Height = 160
barWaves[14] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 160, drawBasicBarrier));

  objectQueue[y+20] = [];
  objectQueue[y+20].push(new Side(150, y+90, 70, true, drawBasic1SideA));
  objectQueue[y+20].push(new Side(350, y+90, 70, false, drawBasic1SideB));
}
barWaves[14].height = 160;

// Height = 160
barWaves[15] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 160, drawBasicBarrier));

  objectQueue[y+20] = [];
  objectQueue[y+20].push(new Side(150, y+90, 70, false, drawBasic1SideA));
  objectQueue[y+20].push(new Side(350, y+90, 70, true, drawBasic1SideB));
}
barWaves[15].height = 160;

// Height = 160
barWaves[16] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 160, drawBasicBarrier));

  objectQueue[y+20] = [];
  objectQueue[y+20].push(new Side(150, y+90, 70, false, drawBasic1SideB));
  objectQueue[y+20].push(new Side(350, y+90, 70, true, drawBasic1SideA));
}
barWaves[16].height = 160;

// Height = 160
barWaves[17] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 160, drawBasicBarrier));

  objectQueue[y+20] = [];
  objectQueue[y+20].push(new Side(150, y+90, 70, true, drawBasic1SideB));
  objectQueue[y+20].push(new Side(350, y+90, 70, false, drawBasic1SideA));
}
barWaves[17].height = 160;

function narrowSides(y) {
  levelSides[nextInd].next = y;
  levelSides[y] = { x: SIDE_WIDTH, next: y + 20 };
  levelSides[y + 20] = { x: WIDTH/2-SHIP_WIDTH/2-1, next: y + 40 };
  levelSides[y + 40] = { x: SIDE_WIDTH, next: undefined };
  nextInd = y + 40;
}

// In-place shuffles elements of a in [min, max)
function shuffleArray(a, min, max) {
  var random = Alea();
  var i, temp, rand;
  var rng = max - min;
  for (i = min; i < max; ++i) {
    rand = i + Math.floor(random() * (rng - i + min));
    temp = a[i];
    a[i] = a[rand];
    a[rand] = temp;
  }
}
