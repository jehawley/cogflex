// levels.js
// Contains methods for building and managing levels

// 0 for left = good, 1 for right = good
var testSide = [];
// The trial counts
var testTrials = [];
// Holds arrays of game objects indexed by object top
var objectQueue = [];
// Singly linked list starting at y=0
// Indexed by y coordinate, contains {x, next}
var levelSides = [];
// The x values at which data collection should happen
// Set by narrowSides
var recordState = [];
// The old index whose next value needs setting
var nextInd;

var levelEnd;
var player = new Ship(WIDTH / 2, drawBasicShip);

function buildLevel(number, lengthBound) {
  objectQueue = [];
  levelSides = [];

  var i, j;
  var temp;
  // Each object has parameters w (array of wave ids),
  //                            wa (arguments to wave functions)
  var waveSeq = [];
  // The test sides for this particular level
  var tsSlice = [];
  var accum = OFFSET + 300;
  var random = Alea();

  while (tsSlice.length < lengthBound && testTrials.length > 1) {
    tsSlice = tsSlice.concat(testSide.slice(0, testTrials[0] + testTrials[1]));
    testSide = testSide.slice(testTrials[0] + testTrials[1]);
    testTrials.slice(2);
  }
  if (tsSlice.length < lengthBound) {
    while (tsSlice.length < lengthBound) {
      tsSlice.push(-1);
    }
  }

  levelSides[0] = { x: SIDE_WIDTH, next: undefined };
  nextInd = 0;

  buildLevelWaves[1](waveSeq, tsSlice.length);
  
  for (i = 0; i < tsSlice.length; ++i) {
    for (j = 0; j < waveSeq[i].w.length; ++j) {
      waves[waveSeq[i].w[j]](waveSeq[i].wa[j], accum);
      accum += (waves[waveSeq[i].w[j]].height +
                Math.floor(random() * 40) + 60);
    }

    accum += 35;

    if (tsSlice[i] > -1) {
      narrowSides(accum);
      accum += 145;
      barWaves[14 + tsSlice[i] + 2 * Math.round(random())](accum);
      accum += (barWaves[14].height + Math.floor(random() * 20) + 110);
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

  i = 0;
  while (levelSides[i].next) {
    if ((levelSides[i].next - i) > 2000) {
      levelSides[i + 2000] = { x: SIDE_WIDTH, next: levelSides[i].next };
      levelSides[i].next = i + 2000;
    }
    i = levelSides[i].next;
  }
}

function buildLevel1Waves(waveSeq, levelLength) {
  // The fractions of the level corresponding to each set of waves
  // sector lengths : [0.12 0.8 0.15 0.2 0.2 0.25];
  var sectors = [0.12, 0.2, 0.35, 0.55, 0.75];
  var secStops = sectors.map(function (x) {
                               return Math.floor(x * levelLength);
                             } );
  var i;
  var waveQueues = [ [15, 16],
                     [[6, 7], [7, 6]],
                     [13, 21, 22, 23],
                     [[24], [17], [18], [17], [18],
                      [17, 16], [18, 15], [17, 18], [18, 17]],
                     [2, 3, 4, 5],
                     [[2, 2], [3, 3], [4, 4], [5, 5], [5, 20],
                      [4, 5], [3, 2], [3, 5]]];
  var random = Alea();
  var num, tempY;
  var singletonAdded = false;

  for (i = 0; i < secStops[0]; ++i) {
    num = waveQueues[0][0];
    waveSeq[i] = { w: [num],
                   wa: [60 + random() * (WIDTH - waves[num].width - 120)] };
    waveQueues[0].push(waveQueues[0].shift());
  }
  shuffleArray(waveSeq, 0, secStops[0]);

  for (; i < secStops[1]; ++i) {
    num = waveQueues[1][0];
    waveSeq[i] = { w: num,
                   wa: [60, 60] };
    waveQueues[1].push(waveQueues[1].shift());
  }
  shuffleArray(waveSeq, secStops[0], secStops[1]);

  singletonAdded = false;
  for (; i < secStops[2]; ++i) {
    if (singletonAdded) {
      num = waveQueues[2][0];
      waveSeq[i] = { w: [num],
                     wa: [60] };
      waveQueues[2].push(waveQueues[2].shift());
    } else {
      waveSeq[i] = { w: [14],
                     wa: [60] };
      singletonAdded = true;
    }
  }
  shuffleArray(waveSeq, secStops[1], secStops[2]);

  for (; i < secStops[3]; ++i) {
    num = waveQueues[3][0];
    if (num.length === 1) {
      waveSeq[i] = { w: num,
                     wa: [60] };
    } else {
      waveSeq[i] = { w: num,
                     wa: [60, 60] };
    }
    waveQueues[3].push(waveQueues[3].shift());
  }
  shuffleArray(waveSeq, secStops[2], secStops[3]);

  singletonAdded = false;
  for (; i < secStops[4]; ++i) {
    if (singletonAdded) {
      num = waveQueues[4][0];
      waveSeq[i] = { w: [num],
                     wa: [60 + random() * (WIDTH-waves[num].width-120)] }; 
      waveQueues[4].push(waveQueues[4].shift());
    } else {
      waveSeq[i] = { w: [19],
                     wa: [100] };
      singletonAdded = true;
    }
  }
  shuffleArray(waveSeq, secStops[3], secStops[4]);

  for (; i < (levelLength - 1); ++i) {
    num = waveQueues[5][0];
    waveSeq[i] = { w: num,
                   wa: [60 + random() * (WIDTH-waves[num[0]].width-120),
                        60 + random() * (WIDTH-waves[num[1]].width-120)] };
    waveQueues[5].push(waveQueues[5].shift());
  }
  shuffleArray(waveSeq, secStops[4], i);

  //Finale
  waveSeq[i] = { w: [2, 3, 4, 5, 4, 5], wa: [60, 60, 60, 60, 60, 60]};
}

var buildLevelWaves = [];
buildLevelWaves[1] = buildLevel1Waves;

// splits: The number of probability regions
// success: The probability of success in each region
// trials: The number of trials in each region
function initTestValues(splits, success, trials) {
  testTrials = trials;
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
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawEnemy));
};
waves[0].width = 200;
waves[0].height = 20;

// Width = 200, Height = 20
waves[1] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));
};
waves[1].width = 200;
waves[1].height = 20;

// Width = 290, Height = 200
waves[2] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+75, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+205, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+270, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+75, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+140, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+205, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+270, y+70, 20, drawEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Enemy(x+75, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+140, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+205, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+270, y+130, 20, drawEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Enemy(x+10, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Enemy(x+75, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Enemy(x+140, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Coin(x+205, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Coin(x+270, y+190, 10, drawCoin));
};
waves[2].width = 290;
waves[2].height = 200;

// Width = 290, Height = 200
waves[3] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+205, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+270, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+75, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+140, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+205, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+270, y+70, 20, drawEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+75, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+140, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+205, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Enemy(x+270, y+130, 20, drawEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Coin(x+10, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Coin(x+75, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Enemy(x+140, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Enemy(x+205, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Enemy(x+270, y+190, 20, drawEnemy));
};
waves[3].width = 290;
waves[3].height = 200;

// Width = 290, Height = 170
waves[4] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+75, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+205, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+270, y+10, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+10, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+75, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(x+140, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+205, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(x+270, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+10, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Enemy(x+75, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+140, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+205, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+270, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+10, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Enemy(x+75, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Enemy(x+140, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Coin(x+205, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+270, y+160, 10, drawCoin));
};
waves[4].width = 290;
waves[4].height = 170;

// Width = 290, Height = 170
waves[5] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+205, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+270, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+10, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(x+75, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+140, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(x+205, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+270, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+10, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+75, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+140, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+205, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Enemy(x+270, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Coin(x+10, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+75, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Enemy(x+140, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Enemy(x+205, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Enemy(x+270, y+160, 20, drawEnemy));
};
waves[5].width = 290;
waves[5].height = 170;

// Width = 320, Height = 20
waves[6] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+250, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+310, y+10, 10, drawCoin));
};
waves[6].width = 320;
waves[6].height = 20;

// Width = 320, Height = 20
waves[7] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+310, y+10, 20, drawEnemy));
};
waves[7].width = 320;
waves[7].height = 20;

// Width = 260, Height = 200
waves[8] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+70, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+130, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+190, y+70, 20, drawEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+70, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+130, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+190, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+250, y+130, 20, drawEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Coin(x+10, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Enemy(x+130, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Coin(x+250, y+190, 10, drawCoin));
};
waves[8].width = 260;
waves[8].height = 200;

// Width = 260, Height = 260
waves[9] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+70, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+130, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+190, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+10, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+70, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+190, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+250, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+70, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Coin(x+130, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Enemy(x+190, y+160, 20, drawEnemy));

  objectQueue[y+200] = [];
  objectQueue[y+200].push(new Enemy(x+130, y+210, 20, drawEnemy));
};
waves[9].width = 260;
waves[9].height = 260;

// Width = 380, Height = 320
waves[10] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+130, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+190, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+250, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+70, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+190, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+250, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+310, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+10, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Coin(x+70, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+130, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+190, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+250, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+310, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Enemy(x+370, y+160, 20, drawEnemy));

  objectQueue[y+200] = [];
  objectQueue[y+200].push(new Enemy(x+70, y+210, 20, drawEnemy));
  objectQueue[y+200].push(new Coin(x+130, y+210, 10, drawCoin));
  objectQueue[y+200].push(new Coin(x+190, y+210, 10, drawCoin));
  objectQueue[y+200].push(new Coin(x+250, y+210, 10, drawCoin));
  objectQueue[y+200].push(new Enemy(x+310, y+210, 20, drawEnemy));

  objectQueue[y+250] = [];
  objectQueue[y+250].push(new Enemy(x+130, y+260, 20, drawEnemy));
  objectQueue[y+250].push(new Coin(x+190, y+260, 10, drawCoin));
  objectQueue[y+250].push(new Enemy(x+250, y+260, 20, drawEnemy));

  objectQueue[y+300] = [];
  objectQueue[y+300].push(new Enemy(x+190, y+310, 20, drawEnemy));
};
waves[10].width = 380;
waves[10].height = 320;

// Width = 380, Height = 320
waves[11] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+130, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+190, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+250, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+70, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+190, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+250, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+310, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+10, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Powerup(x+70, y+160, 20, drawPowerup));
  objectQueue[y+150].push(new Coin(x+130, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+190, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+250, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+310, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Enemy(x+370, y+160, 20, drawEnemy));

  objectQueue[y+200] = [];
  objectQueue[y+200].push(new Enemy(x+70, y+210, 20, drawEnemy));
  objectQueue[y+200].push(new Coin(x+130, y+210, 10, drawCoin));
  objectQueue[y+200].push(new Coin(x+190, y+210, 10, drawCoin));
  objectQueue[y+200].push(new Coin(x+250, y+210, 10, drawCoin));
  objectQueue[y+200].push(new Enemy(x+310, y+210, 20, drawEnemy));

  objectQueue[y+250] = [];
  objectQueue[y+250].push(new Enemy(x+130, y+260, 20, drawEnemy));
  objectQueue[y+250].push(new Coin(x+190, y+260, 10, drawCoin));
  objectQueue[y+250].push(new Enemy(x+250, y+260, 20, drawEnemy));

  objectQueue[y+300] = [];
  objectQueue[y+300].push(new Enemy(x+190, y+310, 20, drawEnemy));
};
waves[11].width = 380;
waves[11].height = 320;

// Width = 380, Height = 320
waves[12] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+130, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+190, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+250, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+70, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+190, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+250, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+310, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+10, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Coin(x+70, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+130, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+190, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+250, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Powerup(x+310, y+160, 20, drawPowerup));
  objectQueue[y+150].push(new Enemy(x+370, y+160, 20, drawEnemy));

  objectQueue[y+200] = [];
  objectQueue[y+200].push(new Enemy(x+70, y+210, 20, drawEnemy));
  objectQueue[y+200].push(new Coin(x+130, y+210, 10, drawCoin));
  objectQueue[y+200].push(new Coin(x+190, y+210, 10, drawCoin));
  objectQueue[y+200].push(new Coin(x+250, y+210, 10, drawCoin));
  objectQueue[y+200].push(new Enemy(x+310, y+210, 20, drawEnemy));

  objectQueue[y+250] = [];
  objectQueue[y+250].push(new Enemy(x+130, y+260, 20, drawEnemy));
  objectQueue[y+250].push(new Coin(x+190, y+260, 10, drawCoin));
  objectQueue[y+250].push(new Enemy(x+250, y+260, 20, drawEnemy));

  objectQueue[y+300] = [];
  objectQueue[y+300].push(new Enemy(x+190, y+310, 20, drawEnemy));
};
waves[12].width = 380;
waves[12].height = 320;

// Width = 380, Height = 80
waves[13] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+310, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+370, y+10, 10, drawCoin));
  
  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+70, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+130, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+190, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+250, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+310, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+370, y+70, 20, drawEnemy));
};
waves[13].width = 380;
waves[13].height = 80;

// Width = 380, Height = 80
waves[14] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+310, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+370, y+10, 10, drawCoin));
  
  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+70, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+130, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+190, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+250, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+310, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Powerup(x+370, y+70, 20, drawPowerup));
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
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+75, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+205, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+270, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+75, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+140, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+205, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+270, y+70, 20, drawEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Enemy(x+75, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+140, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+205, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+270, y+130, 20, drawEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Enemy(x+10, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Enemy(x+75, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Enemy(x+140, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Coin(x+205, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Powerup(x+270, y+190, 20, drawPowerup));
};
waves[19].width = 290;
waves[19].height = 200;

// Width = 290, Height = 200
waves[20] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+205, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+270, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+75, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+140, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+205, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+270, y+70, 20, drawEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+75, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+140, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+205, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Enemy(x+270, y+130, 20, drawEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Powerup(x+10, y+190, 20, drawPowerup));
  objectQueue[y+180].push(new Coin(x+75, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Enemy(x+140, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Enemy(x+205, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Enemy(x+270, y+190, 20, drawEnemy));
};
waves[20].width = 290;
waves[20].height = 200;

// Width = 380, Height = 80
waves[21] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+250, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+310, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+370, y+10, 20, drawEnemy));
  
  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+70, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+130, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+190, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+250, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+310, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+370, y+70, 10, drawCoin));
};
waves[21].width = 380;
waves[21].height = 80;

// Width = 380, Height = 80
waves[22] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+250, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+310, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+370, y+10, 10, drawCoin));
  
  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+70, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+130, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+190, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+250, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+310, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+370, y+70, 20, drawEnemy));
};
waves[22].width = 380;
waves[22].height = 80;

// Width = 380, Height = 80
waves[23] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+310, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+370, y+10, 20, drawEnemy));
  
  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+70, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+130, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+190, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+250, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+310, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+370, y+70, 10, drawCoin));
};
waves[23].width = 380;
waves[23].height = 80;

// Width = 140, Height = 140
waves[24] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Powerup(x+70, y+70, 20, drawPowerup));
  objectQueue[y+60].push(new Enemy(x+130, y+70, 20, drawEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+10, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+70, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+130, y+130, 10, drawCoin));
}
waves[24].width = 140;
waves[24].height = 140;

// Barrier Waves
// Each wave takes a y coordinate of the top of the barrier
// Each wave has a height, which is the length of the barrier
var barWaves = [];

// Height = 100
barWaves[0] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBarrier));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(100, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(150, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(200, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(300, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(350, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(400, y+70, 20, drawEnemy));
};
barWaves[0].height = 100;

// Height = 100
barWaves[1] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBarrier));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(100, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(150, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(200, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(300, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(350, y+70, 20, drawCoin));
  objectQueue[y+60].push(new Coin(400, y+70, 10, drawCoin));
};
barWaves[1].height = 100;

// Height = 100
barWaves[2] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBarrier));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(100, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Powerup(150, y+70, 20, drawPowerup));
  objectQueue[y+60].push(new Coin(200, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(300, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(350, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(400, y+70, 20, drawEnemy));
};
barWaves[2].height = 100;

// Height = 100
barWaves[3] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 100, drawBarrier));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(100, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(150, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(200, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(300, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Powerup(350, y+70, 20, drawPowerup));
  objectQueue[y+60].push(new Coin(400, y+70, 10, drawCoin));
};
barWaves[3].height = 100;

// Height = 120
barWaves[4] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 120, drawBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(150, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(350, y+60, 20, drawEnemy));

  objectQueue[y+80] = [];
  objectQueue[y+80].push(new Coin(110, y+90, 10, drawCoin));
  objectQueue[y+80].push(new Coin(190, y+90, 10, drawCoin));
  objectQueue[y+80].push(new Enemy(310, y+90, 20, drawEnemy));
  objectQueue[y+80].push(new Enemy(390, y+90, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(150, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(350, y+110, 20, drawEnemy));
};
barWaves[4].height = 120;

// Height = 120
barWaves[5] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 120, drawBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(150, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(350, y+60, 10, drawCoin));

  objectQueue[y+80] = [];
  objectQueue[y+80].push(new Enemy(110, y+90, 20, drawEnemy));
  objectQueue[y+80].push(new Enemy(190, y+90, 20, drawEnemy));
  objectQueue[y+80].push(new Coin(310, y+90, 10, drawCoin));
  objectQueue[y+80].push(new Coin(390, y+90, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(150, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(350, y+110, 10, drawCoin));
};
barWaves[5].height = 120;

// Height = 80
barWaves[6] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(100, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(150, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(200, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(300, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(350, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(400, y+60, 20, drawEnemy));
};
barWaves[6].height = 80;

// Height = 80
barWaves[7] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(100, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(150, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(200, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(300, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(350, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(400, y+60, 10, drawCoin));
};
barWaves[7].height = 80;

// Height = 80
barWaves[8] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(100, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Powerup(150, y+60, 20, drawPowerup));
  objectQueue[y+50].push(new Coin(200, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(300, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(350, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(400, y+60, 20, drawEnemy));
};
barWaves[8].height = 80;

// Height = 80
barWaves[9] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(100, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(150, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(200, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(300, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Powerup(350, y+60, 20, drawPowerup));
  objectQueue[y+50].push(new Coin(400, y+60, 10, drawCoin));
};
barWaves[9].height = 80;

// Height = 80
barWaves[10] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Powerup(100, y+60, 20, drawPowerup));
  objectQueue[y+50].push(new Coin(150, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(200, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(300, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(350, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(400, y+60, 20, drawEnemy));
};
barWaves[10].height = 80;

// Height = 80
barWaves[11] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(100, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(150, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(200, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(300, y+60, 10, drawPowerup));
  objectQueue[y+50].push(new Coin(350, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(400, y+60, 10, drawCoin));
};
barWaves[11].height = 80;

// Height = 80
barWaves[12] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(100, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(150, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Powerup(200, y+60, 20, drawPowerup));
  objectQueue[y+50].push(new Enemy(300, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(350, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(400, y+60, 20, drawEnemy));
};
barWaves[12].height = 80;

// Height = 80
barWaves[13] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 80, drawBarrier));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(100, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(150, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(200, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(300, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(350, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Powerup(400, y+60, 20, drawPowerup));
};
barWaves[13].height = 80;

// Height = 160
barWaves[14] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 160, drawBarrier));

  objectQueue[y+20] = [];
  objectQueue[y+20].push(new Side(150, y+90, 70, true, drawBasic1SideA));
  objectQueue[y+20].push(new Side(350, y+90, 70, false, drawBasic1SideB));
}
barWaves[14].height = 160;

// Height = 160
barWaves[15] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 160, drawBarrier));

  objectQueue[y+20] = [];
  objectQueue[y+20].push(new Side(150, y+90, 70, false, drawBasic1SideA));
  objectQueue[y+20].push(new Side(350, y+90, 70, true, drawBasic1SideB));
}
barWaves[15].height = 160;

// Height = 160
barWaves[16] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 160, drawBarrier));

  objectQueue[y+20] = [];
  objectQueue[y+20].push(new Side(150, y+90, 70, false, drawBasic1SideB));
  objectQueue[y+20].push(new Side(350, y+90, 70, true, drawBasic1SideA));
}
barWaves[16].height = 160;

// Height = 160
barWaves[17] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 160, drawBarrier));

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

  recordState.push(y + 170);
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
