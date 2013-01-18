// levels.js
// Contains methods for building and managing levels

// 0 for left = good, 1 for right = good
var testSide = [];
// The trial counts
var testTrials = [];
// Holds arrays of game objects indexed by object top
var objectQueue = [];
// A list of all nonempty indices of objectQueue
var objectIndices = [];
// Singly linked list starting at y=0
// Indexed by y coordinate, contains {x, next}
var levelSides = [];
// The x values at which data collection should happen
// Set by narrowSides
var recordState = [];
// The old index whose next value needs setting
var nextInd;

var levelEnd;
var player = new Ship(WIDTH / 2, drawShip);

function buildLevel() {
  objectQueue = [];
  levelSides = [];
  player = new Ship(WIDTH / 2, drawShip);

  var i, j;
  var temp;
  var sideSwap;
  // Each object has parameters w (array of wave ids),
  //                            wa (arguments to wave functions)
  var waveSeq = [];
  // The test sides for this particular level
  var tsSlice = [];
  var accum = OFFSET + 300;
  var random = Alea();

  while (tsSlice.length < LEVEL_LENGTH_MIN[chosenLevel] &&
         testTrials.length > 1) {
    tsSlice = tsSlice.concat(testSide.slice(0, testTrials[0] + testTrials[1]));
    testSide = testSide.slice(testTrials[0] + testTrials[1]);
    testTrials = testTrials.slice(2);
  }

  if (tsSlice.length < LEVEL_LENGTH_MIN[chosenLevel]) {
    while (tsSlice.length < LEVEL_LENGTH_MIN[chosenLevel]) {
      tsSlice.push(-1);
    }
  }

  levelSides[0] = { x: SIDE_WIDTH, next: undefined };
  nextInd = 0;

  buildLevelWaves[chosenLevel](waveSeq, tsSlice.length);
  
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
      sideSwap = 2 * Math.round(random());
      // TODO : Fix this hack - only works for initial config
      if (sideSwap > 0) {
        correctSideRecord[chosenLevel][i] = 1 -
                                            correctSideRecord[chosenLevel][i];
        winLossRecord[chosenLevel][i] = 1 - winLossRecord[chosenLevel][i];
      }
      barWaves[tsSlice[i] + sideSwap](accum);
      accum += (barWaves[0].height + Math.floor(random() * 20) + 110);
    } else {
      accum += 30;
      waves[17](60, accum);
      accum += waves[17].height;
      accum += 60;
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

  for (i = 0; i < objectQueue.length; ++i) {
    if (objectQueue[i]) {
      objectIndices.push(i);
    }
  }
}

var buildLevelWaves = [];
buildLevelWaves[1] = function (waveSeq, levelLength) {
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
                   wa: [randomPos(num)] };
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
                     wa: [randomPos(num)] }; 
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
                   wa: [randomPos(num[0]), randomPos(num[1])] };
    waveQueues[5].push(waveQueues[5].shift());
  }
  shuffleArray(waveSeq, secStops[4], i);

  //Finale
  waveSeq[i] = { w: [2, 3, 4, 5, 4, 5], wa: [60, 60, 60, 60, 60, 60]};
};

buildLevelWaves[2] = function (waveSeq, levelLength) {
  // The fractions of the level corresponding to each set of waves
  // sectpr lengths: [0.06, 0.1, 0.24, 0.2, 0.2, 0.2 ];
  var sectors = [0.06, 0.16, 0.4, 0.6, 0.8];
  var secStops = sectors.map(function (x) {
                               return Math.floor(x * levelLength);
                             } );
  var i;
  var waveQueues = [ [32, 33, 28, 29],
                     [ [32, 33], [28, 28], [32, 29], [32, 32], [33, 33],
                       [29, 29], [33, 28], [33, 29], [28, 29] ],
                     [ [38], [39], [40], [41], [42], [43],
                       [38, 41], [39, 40], [38, 42], [42, 43], [41, 41],
                       [39, 38], [41, 42], [43, 39], [40, 30], [39, 42] ],
                     [ [26], [27], [8], [25], [26, 32], [27, 28], [8, 33], 
                       [25, 32], [26, 29], [27, 33], [8, 29], [25, 28] ],
                     [ [10], [9], [10, 32], [10, 33], [10, 28], [10, 29],
                       [11], [9, 32], [9, 28], [9, 33], [9, 29] ],
                     [ [35], [37], [35, 29], [35, 32], [37, 28], [37, 33],
                       [35, 35], [37, 37], [35, 33], [37, 29] ] ];
  var random = Alea();
  var num, tempY;
  var singletonAdded = false;

  for (i = 0; i < secStops[0]; ++i) {
    num = waveQueues[0][0];
    waveSeq[i] = { w: [num],
                   wa: [randomPos(num)] };
    waveQueues[0].push(waveQueues[0].shift());
  }
  shuffleArray(waveSeq, 0, secStops[0]);

  singletonAdded = false;
  for (; i < secStops[1]; ++i) {
    if (singletonAdded) {
      num = waveQueues[1][0];
      waveSeq[i] = { w: num,
                     wa: [randomPos(num[0]), randomPos(num[1])] };
      waveQueues[1].push(waveQueues[1].shift());
    } else {
      waveSeq[i] = { w: [34],
                     wa: [randomPos(34)] };
      singletonAdded = true;
    }
  }
  shuffleArray(waveSeq, secStops[0], secStops[1]);

  singletonAdded = false;
  for (; i < secStops[2]; ++i) {
    if (singletonAdded) {
      num = waveQueues[2][0];
      if (num.length === 1) {
        waveSeq[i] = { w: num, 
                       wa: [randomPos(num[0])] };
      } else {
        waveSeq[i] = { w: num,
                       wa: [randomPos(num[0]), randomPos(num[1])] };
      }
      waveQueues[2].push(waveQueues[2].shift());
    } else {
      waveSeq[i] = { w: [44],
                     wa: [randomPos(44)] };
      singletonAdded = true;
    }
  }
  shuffleArray(waveSeq, secStops[1], secStops[2]);

  for (; i < secStops[3]; ++i) {
    num = waveQueues[3][0];
    if (num.length === 1) {
      waveSeq[i] = { w: num, 
                     wa: [randomPos(num[0])] };
    } else {
      waveSeq[i] = { w: num,
                     wa: [randomPos(num[0]), randomPos(num[1])] };
    }
    waveQueues[3].push(waveQueues[3].shift());
  }
  shuffleArray(waveSeq, secStops[2], secStops[3]);

  singletonAdded = false;
  for (; i < secStops[4]; ++i) {
    if (singletonAdded) {
      num = waveQueues[4][0];
      if (num.length === 1) {
        waveSeq[i] = { w: num, 
                       wa: [randomPos(num[0])] };
      } else {
        waveSeq[i] = { w: num,
                       wa: [randomPos(num[0]), randomPos(num[1])] };
      }
      waveQueues[4].push(waveQueues[4].shift());
    } else {
      waveSeq[i] = { w: [44],
                     wa: [randomPos(44)] };
      singletonAdded = true;
    }
  }
  shuffleArray(waveSeq, secStops[3], secStops[4]);

  for (; i < (levelLength - 1); ++i) {
    num = waveQueues[5][0];
    if (num.length === 1) {
      waveSeq[i] = { w: num, 
                     wa: [randomPos(num[0])] };
    } else {
      waveSeq[i] = { w: num,
                     wa: [randomPos(num[0]), randomPos(num[1])] };
    }
    waveQueues[5].push(waveQueues[5].shift());
  }
  shuffleArray(waveSeq, secStops[4], i);

  // Finale
  waveSeq[i] = { w: [26, 27, 26, 27, 37], wa: [90, 90, 90, 90, 90] };
};

buildLevelWaves[3] = function (waveSeq, levelLength) {
  // The fractions of the level corresponding to each set of waves
  // sector lengths: [0.06, 0.1, 0.24, 0.2, 0.2, 0.2 ];
  var sectors = [0.1, 0.25, 0.5, 0.75];
  var secStops = sectors.map(function (x) {
                               return Math.floor(x * levelLength);
                             } );
  var i;
  var waveQueues = [ [17, 18],
                     [2, 3, 4, 5],
                     [30, 31, 45, 46],
                     [47, 48, 49, 50],
                     [57, 51, 52, 53, 54, 55, 56, 51, 52, 53, 54, 55, 56] ];
  var random = Alea();
  var num, tempY;
  var singletonAdded = false;

  for (i = 0; i < secStops[0]; ++i) {
    num = waveQueues[0][0];
    waveSeq[i] = { w: [num],
                   wa: [randomPos(num)] };
    waveQueues[0].push(waveQueues[0].shift());
  }
  shuffleArray(waveSeq, 0, secStops[0]);

  singletonAded = false;
  for (; i < secStops[1]; ++i) {
    if (singletonAdded) {
      num = waveQueues[1][0];
      waveSeq[i] = { w: [num],
                     wa: [randomPos(num)] };
      waveQueues[1].push(waveQueues[1].shift());
    } else {
      waveSeq[i] = { w: [20],
                     wa: [randomPos(20)] };
      singletonAdded = true;
    }
  }
  shuffleArray(waveSeq, secStops[0], secStops[1]);

  for (; i < secStops[2]; ++i) {
    num = waveQueues[2][0];
    waveSeq[i] = { w: [num],
                   wa: [randomPos(num)] };
    waveQueues[2].push(waveQueues[2].shift());
  }
  shuffleArray(waveSeq, secStops[1], secStops[2]);

  for (; i < secStops[3]; ++i) {
    num = waveQueues[3][0];
    waveSeq[i] = { w: [num],
                   wa: [randomPos(num)] };
    waveQueues[3].push(waveQueues[3].shift());
  }
  shuffleArray(waveSeq, secStops[2], secStops[3]);

  for (; i < (levelLength-1); ++i) {
    num = waveQueues[4][0];
    waveSeq[i] = { w: [num],
                   wa: [randomPos(num)] };
    waveQueues[4].push(waveQueues[4].shift());
  }
  shuffleArray(waveSeq, secStops[3], i);

  // Finale
  waveSeq[i] = { w: [51, 55, 54, 53], wa: [90, 90, 90, 90] };
}

buildLevelWaves[4] = function (waveSeq, levelLength) {
  // The fractions of the level corresponding to each set of waves
  // sector lengths: [0.25, 0.25, 0.25, 0.25 ];
  var sectors = [0.25, 0.5, 0.75];
  var secStops = sectors.map(function (x) {
                               return Math.floor(x * levelLength);
                             } );
  var i;
  var waveQueues = [ [59, 60, 62, 63, 64, 65, 61, 59, 60, 62, 63, 64, 65],
                     [49, 50, 66, 67, 68, 69, 66, 67, 68, 69, 58],
                     [[70], [71], [72], [73],
                      [61, 70], [65, 72], [64, 71], [63, 73]],
                     [[74], [75], [76], [77], [74, 75], [75, 76], [76, 77],
                      [74, 76], [75, 77]]
                   ];
  var random = Alea();
  var num, tempY;
  var singletonAdded = false;

  for (i = 0; i < secStops[0]; ++i) {
    num = waveQueues[0][0];
    waveSeq[i] = { w: [num],
                   wa: [randomPos(num)] };
    waveQueues[0].push(waveQueues[0].shift());
  }
  shuffleArray(waveSeq, 0, secStops[0]);

  for ( ; i < secStops[1]; ++i) {
    num = waveQueues[1][0];
    waveSeq[i] = { w: [num],
                   wa: [randomPos(num)] };
    waveQueues[1].push(waveQueues[1].shift());
  }
  shuffleArray(waveSeq, secStops[0], secStops[1]);

  for ( ; i < secStops[2]; ++i) {
    num = waveQueues[2][0];
    if (num.length === 1) {
      waveSeq[i] = { w: num,
                     wa: [randomPos(num[0])] };
    } else {
      waveSeq[i] = { w: num,
                     wa: [randomPos(num[0]),
                          randomPos(num[1])] };
    }
    waveQueues[2].push(waveQueues[2].shift());
  }
  shuffleArray(waveSeq, secStops[1], secStops[2]);

  for (; i < (levelLength-1); ++i) {
    num = waveQueues[3][0];
    if (num.length === 1) {
      waveSeq[i] = { w: num,
                     wa: [randomPos(num[0])] };
    } else {
      waveSeq[i] = { w: num,
                     wa: [randomPos(num[0]), randomPos(num[1])] };
    }
    waveQueues[3].push(waveQueues[3].shift());
  }
  shuffleArray(waveSeq, secStops[2], i);

  //Finale
  waveSeq[i] = { w: [74, 76, 74, 76, 75, 77], wa: [80, 80, 80, 80, 80, 80] };
}

// splits: The number of probability regions
// success: The probability of success in each region
// trials: The number of trials in each region
// reverse: If true, the current trial is a reversal of the previous trial
//          Otherwise, it is independent
function initTestValues(splits, success, trials, reverse) {
  testTrials = trials;
  var i, j;
  var random = Alea();
  var side = Math.round(random());
  var oldLen = 0;

  sideImageCount = 0;
  sideImageCurr = 0;
  sideImageChangeover = [];

  for (i = 0; i < splits; ++i) {
    if (reverse[i]) {
      side = 1 - side;
    } else {
      side = Math.round(random());
      if (i > 0) {
        sideImageChangeover.push(trials.slice(0, i).reduce(function (x, y) {
                                                             return x + y;
                                                           }, 0));
      }
    }
    for (j = 0; j < trials[i]; ++j) {
      // TODO: Replace fixed level structure hack here
      successP[Math.floor(0.25 * i) + 1].push(success[i]);
      correctSideRecord[Math.floor(0.25 * i) + 1].push(side);
      reversed[Math.floor(0.25 * i) + 1].push(reverse[i]);
      if (j < success[i] * trials[i]) {
        winLossRecord[Math.floor(0.25 * i) + 1].push(side);
        testSide.push(side);
      } else {
        winLossRecord[Math.floor(0.25 * i) + 1].push(1 - side);
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

// Width = 260, Height = 200
waves[25] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+70, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+130, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+190, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+10, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+70, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+130, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+190, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+250, y+130, 10, drawCoin));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Enemy(x+10, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Coin(x+130, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Enemy(x+250, y+190, 20, drawEnemy));
}
waves[25].width = 260;
waves[25].height = 200;

// Width = 320, Height = 170
waves[26] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+160, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+110, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+160, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+210, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+60, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+110, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Enemy(x+160, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Enemy(x+210, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+260, y+110, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Coin(x+10, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Enemy(x+60, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Enemy(x+110, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Enemy(x+160, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Enemy(x+210, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Enemy(x+260, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Coin(x+310, y+160, 10, drawCoin));
}
waves[26].width = 320;
waves[26].height = 170;

// Width = 320, Height = 170
waves[27] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+160, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+110, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+160, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+210, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+60, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+110, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+160, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+210, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+260, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+10, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Coin(x+60, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+110, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+160, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+210, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+260, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Enemy(x+310, y+160, 20, drawEnemy));
}
waves[27].width = 320;
waves[27].height = 170;

// Width = 140, Height = 140
waves[28] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+70, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+130, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Enemy(x+130, y+130, 20, drawEnemy));
}
waves[28].width = 140;
waves[28].height = 140;

// Width = 140, Height = 140
waves[29] = function (x, y) {
  objectQueue[y] = [];

  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+70, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+130, y+70, 20, drawEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+10, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+130, y+130, 10, drawCoin));
}
waves[29].width = 140;
waves[29].height = 140;

// Width = 260, Height = 170
waves[30] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+10, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+70, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+130, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(x+190, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(x+250, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+10, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+70, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+190, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+250, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+10, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Enemy(x+70, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Enemy(x+130, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Coin(x+190, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Enemy(x+250, y+160, 20, drawEnemy));
}
waves[30].width = 260;
waves[30].height = 170;

// Width = 260, Height = 170
waves[31] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+10, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+70, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(x+130, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(x+190, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+250, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+10, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+70, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+130, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Enemy(x+190, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Enemy(x+250, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+10, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Coin(x+70, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Enemy(x+130, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Enemy(x+190, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Enemy(x+250, y+160, 20, drawEnemy));
}
waves[31].width = 260;
waves[31].height = 170;

// Width = 140, Height = 140
waves[32] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+70, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+130, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+70, y+130, 10, drawCoin));
}
waves[32].width = 140;
waves[32].height = 140;

// Width = 140, Height = 140
waves[33] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+70, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+130, y+70, 20, drawEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+70, y+130, 20, drawEnemy));
}
waves[33].width = 140;
waves[33].height = 140;

// Width = 140, Height = 140
waves[34] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Powerup(x+70, y+10, 20, drawPowerup));
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+70, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+130, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+70, y+130, 10, drawCoin));
}
waves[34].width = 140;
waves[34].height = 140;

// Width = 380, Height = 320 
waves[35] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+70, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+130, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+190, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+250, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+310, y+70, 20, drawEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+70, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+130, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+190, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+250, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+310, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+370, y+130, 20, drawEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Coin(x+10, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Enemy(x+70, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Enemy(x+310, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Coin(x+370, y+190, 10, drawCoin));

  objectQueue[y+240] = [];
  objectQueue[y+240].push(new Enemy(x+10, y+250, 20, drawEnemy));
  objectQueue[y+240].push(new Coin(x+70, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Coin(x+310, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Enemy(x+370, y+250, 20, drawEnemy));

  objectQueue[y+300] = [];
  objectQueue[y+300].push(new Coin(x+10, y+310, 10, drawCoin));
  objectQueue[y+300].push(new Enemy(x+70, y+310, 20, drawEnemy));
  objectQueue[y+300].push(new Enemy(x+310, y+310, 20, drawEnemy));
  objectQueue[y+300].push(new Coin(x+370, y+310, 10, drawCoin));
}
waves[35].width = 380;
waves[35].height = 320;

// Width = 380, Height = 320 
waves[36] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+70, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+130, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+190, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+250, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+310, y+70, 20, drawEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+70, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+130, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+190, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+250, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+310, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+370, y+130, 20, drawEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Coin(x+10, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Enemy(x+70, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Enemy(x+310, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Coin(x+370, y+190, 10, drawCoin));

  objectQueue[y+240] = [];
  objectQueue[y+240].push(new Enemy(x+10, y+250, 20, drawEnemy));
  objectQueue[y+240].push(new Coin(x+70, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Coin(x+310, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Enemy(x+370, y+250, 20, drawEnemy));

  objectQueue[y+300] = [];
  objectQueue[y+300].push(new Coin(x+10, y+310, 10, drawCoin));
  objectQueue[y+300].push(new Enemy(x+70, y+310, 20, drawEnemy));
  objectQueue[y+300].push(new Powerup(x+190, y+310, 20, drawPowerup));
  objectQueue[y+300].push(new Enemy(x+310, y+310, 20, drawEnemy));
  objectQueue[y+300].push(new Coin(x+370, y+310, 10, drawCoin));
}
waves[36].width = 380;
waves[36].height = 320;

// Width = 260, Height = 270
waves[37] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+250, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+100, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(x+160, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+70, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Coin(x+130, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Enemy(x+190, y+160, 20, drawEnemy));

  objectQueue[y+200] = [];
  objectQueue[y+200].push(new Enemy(x+40, y+210, 20, drawEnemy));
  objectQueue[y+200].push(new Coin(x+100, y+210, 10, drawCoin));
  objectQueue[y+200].push(new Coin(x+160, y+210, 10, drawCoin));
  objectQueue[y+200].push(new Enemy(x+220, y+210, 20, drawEnemy));

  objectQueue[y+250] = [];
  objectQueue[y+250].push(new Enemy(x+10, y+260, 20, drawEnemy));
  objectQueue[y+250].push(new Coin(x+70, y+260, 10, drawCoin));
  objectQueue[y+250].push(new Coin(x+130, y+260, 10, drawCoin));
  objectQueue[y+250].push(new Coin(x+190, y+260, 10, drawCoin));
  objectQueue[y+250].push(new Enemy(x+250, y+260, 20, drawEnemy));
}
waves[37].width = 260;
waves[37].height = 270;

// Width = 200, Height = 260
waves[38] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+70, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+130, y+70, 20, drawEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+10, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+70, y+130, 20, drawEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Enemy(x+10, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Coin(x+70, y+190, 10, drawCoin));

  objectQueue[y+240] = [];
  objectQueue[y+240].push(new Coin(x+10, y+250, 10, drawCoin));
}
waves[38].width = 200;
waves[38].height = 260;

// Width = 200, Height = 260
waves[39] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+70, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+130, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+70, y+130, 10, drawCoin));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Coin(x+10, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Enemy(x+70, y+190, 20, drawEnemy));

  objectQueue[y+240] = [];
  objectQueue[y+240].push(new Enemy(x+10, y+250, 20, drawEnemy));
}
waves[39].width = 200;
waves[39].height = 260;

// Width = 200, Height = 260
waves[40] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  
  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+70, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+10, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+70, y+130, 20, drawEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Enemy(x+10, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Coin(x+70, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Enemy(x+130, y+190, 20, drawEnemy));

  objectQueue[y+240] = [];
  objectQueue[y+240].push(new Coin(x+10, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Enemy(x+70, y+250, 20, drawEnemy));
  objectQueue[y+240].push(new Coin(x+130, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Enemy(x+190, y+250, 20, drawEnemy));
}
waves[40].width = 200;
waves[40].height = 260;

// Width = 200, Height = 260
waves[41] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  
  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+70, y+70, 20, drawEnemy));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+70, y+130, 10, drawCoin));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Coin(x+10, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Enemy(x+70, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Coin(x+130, y+190, 10, drawCoin));

  objectQueue[y+240] = [];
  objectQueue[y+240].push(new Enemy(x+10, y+250, 20, drawEnemy));
  objectQueue[y+240].push(new Coin(x+70, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Enemy(x+130, y+250, 20, drawEnemy));
  objectQueue[y+240].push(new Coin(x+190, y+250, 10, drawCoin));
}
waves[41].width = 200;
waves[41].height = 260;

// Width = 200, Height = 260
waves[42] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+70, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+130, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+190, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+190, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+130, y+130, 10, drawCoin));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Coin(x+190, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Enemy(x+130, y+190, 20, drawEnemy));

  objectQueue[y+240] = [];
  objectQueue[y+240].push(new Enemy(x+190, y+250, 20, drawEnemy));
}
waves[42].width = 200;
waves[42].height = 260;

// Width = 200, Height = 260
waves[43] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));
  
  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+190, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+130, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+190, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+130, y+130, 20, drawEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Enemy(x+190, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Coin(x+130, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Enemy(x+70, y+190, 20, drawEnemy));

  objectQueue[y+240] = [];
  objectQueue[y+240].push(new Coin(x+190, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Enemy(x+130, y+250, 20, drawEnemy));
  objectQueue[y+240].push(new Coin(x+70, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Enemy(x+10, y+250, 20, drawEnemy));
}
waves[43].width = 200;
waves[43].height = 260;

// Width = 200, Height = 260
waves[44] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Powerup(x+190, y+10, 20, drawPowerup));
  
  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+190, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+130, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+190, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+130, y+130, 20, drawEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Enemy(x+190, y+190, 20, drawEnemy));
  objectQueue[y+180].push(new Coin(x+130, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Enemy(x+70, y+190, 20, drawEnemy));

  objectQueue[y+240] = [];
  objectQueue[y+240].push(new Coin(x+190, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Enemy(x+130, y+250, 20, drawEnemy));
  objectQueue[y+240].push(new Coin(x+70, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Enemy(x+10, y+250, 20, drawEnemy));
}
waves[44].width = 200;
waves[44].height = 260;

// Width = 215, Height = 120
waves[45] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+205, y+10, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+10, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+75, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(x+140, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+205, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+10, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Enemy(x+75, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Enemy(x+140, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+205, y+110, 10, drawCoin));
}
waves[45].width = 215;
waves[45].height = 120;

// Width = 215, Height = 120
waves[46] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+205, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+10, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+75, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(x+140, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+205, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+10, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+75, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Enemy(x+140, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Enemy(x+205, y+110, 20, drawEnemy));
}
waves[46].width = 215;
waves[46].height = 120;

// Width = 280, Height = 240
waves[47] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+205, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+270, y+10, 10, drawCoin));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Enemy(x+10, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+75, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+140, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+205, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+270, y+65, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+10, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+75, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+140, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+205, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+270, y+120, 20, drawEnemy));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Enemy(x+10, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+75, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+140, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+205, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+270, y+175, 20, drawEnemy));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Coin(x+10, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Enemy(x+75, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+140, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+205, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Coin(x+270, y+230, 10, drawCoin));
}
waves[47].width = 280;
waves[47].height = 240;

// Width = 380, Height = 350
waves[48] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+310, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+370, y+10, 10, drawCoin));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Enemy(x+10, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+70, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+140, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+190, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+250, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+310, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+370, y+65, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+10, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+70, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+130, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+190, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+250, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+310, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+370, y+120, 20, drawEnemy));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Enemy(x+10, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+70, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+130, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+190, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+250, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+310, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+370, y+175, 20, drawEnemy));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Enemy(x+10, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+70, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Coin(x+130, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Enemy(x+190, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Coin(x+250, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Enemy(x+310, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+370, y+230, 20, drawEnemy));

  objectQueue[y+275] = [];
  objectQueue[y+275].push(new Enemy(x+10, y+285, 20, drawEnemy));
  objectQueue[y+275].push(new Coin(x+70, y+285, 10, drawCoin));
  objectQueue[y+275].push(new Enemy(x+130, y+285, 20, drawEnemy));
  objectQueue[y+275].push(new Enemy(x+190, y+285, 20, drawEnemy));
  objectQueue[y+275].push(new Enemy(x+250, y+285, 20, drawEnemy));
  objectQueue[y+275].push(new Coin(x+310, y+285, 10, drawCoin));
  objectQueue[y+275].push(new Enemy(x+370, y+285, 20, drawEnemy));

  objectQueue[y+330] = [];
  objectQueue[y+330].push(new Coin(x+10, y+340, 10, drawCoin));
  objectQueue[y+330].push(new Enemy(x+70, y+340, 20, drawEnemy));
  objectQueue[y+330].push(new Enemy(x+130, y+340, 20, drawEnemy));
  objectQueue[y+330].push(new Enemy(x+190, y+340, 20, drawEnemy));
  objectQueue[y+330].push(new Enemy(x+250, y+340, 20, drawEnemy));
  objectQueue[y+330].push(new Enemy(x+310, y+340, 20, drawEnemy));
  objectQueue[y+330].push(new Coin(x+370, y+340, 10, drawCoin));
}
waves[48].width = 380;
waves[48].height = 350;

// Width = 260, Height = 170
waves[49] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+10, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+70, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(x+130, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+190, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+190, y+110, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+130, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Enemy(x+190, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Coin(x+250, y+160, 10, drawCoin));
}
waves[49].width = 260;
waves[49].height = 170;

// Width = 260, Height = 170
waves[50] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+10, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+70, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(x+130, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+190, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+130, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Enemy(x+190, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Coin(x+130, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Coin(x+190, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Enemy(x+250, y+160, 20, drawEnemy));
}
waves[50].width = 260;
waves[50].height = 170;

// Width = 280, Height = 240
waves[51] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+205, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+270, y+10, 20, drawEnemy));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Enemy(x+10, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+75, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+140, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+205, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+270, y+65, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+10, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+75, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+140, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+205, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+270, y+120, 20, drawEnemy));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Enemy(x+10, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+75, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+140, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+205, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+270, y+175, 20, drawEnemy));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Coin(x+10, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Enemy(x+75, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+140, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+205, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+270, y+230, 20, drawEnemy));
}
waves[51].width = 280;
waves[51].height = 240;

// Width = 280, Height = 240
waves[52] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+205, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+270, y+10, 10, drawCoin));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Enemy(x+10, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+75, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+140, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+205, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+270, y+65, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+10, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+75, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+140, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+205, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+270, y+120, 20, drawEnemy));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Enemy(x+10, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+75, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+140, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+205, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+270, y+175, 20, drawEnemy));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Enemy(x+10, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+75, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+140, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+205, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Coin(x+270, y+230, 10, drawCoin));
}
waves[52].width = 280;
waves[52].height = 240;

// Width = 280, Height = 240
waves[53] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+205, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+270, y+10, 20, drawEnemy));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Enemy(x+10, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+75, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+140, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+205, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+270, y+65, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+10, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+75, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+140, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+205, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+270, y+120, 20, drawEnemy));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Enemy(x+10, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+75, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+140, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+205, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+270, y+175, 20, drawEnemy));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Coin(x+10, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Enemy(x+75, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+140, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+205, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+270, y+230, 20, drawEnemy));
}
waves[53].width = 280;
waves[53].height = 240;

// Width = 280, Height = 240
waves[54] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+205, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+270, y+10, 10, drawCoin));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Enemy(x+10, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+75, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+140, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+205, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+270, y+65, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+10, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+75, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+140, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+205, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+270, y+120, 20, drawEnemy));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Enemy(x+10, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+75, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+140, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+205, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+270, y+175, 20, drawEnemy));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Enemy(x+10, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+75, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+140, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+205, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Coin(x+270, y+230, 10, drawCoin));
}
waves[54].width = 280;
waves[54].height = 240;

// Width = 280, Height = 240
waves[55] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+205, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+270, y+10, 20, drawEnemy));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Enemy(x+10, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+75, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+140, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+205, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+270, y+65, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+10, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+75, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+140, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+205, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+270, y+120, 20, drawEnemy));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Enemy(x+10, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+75, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+140, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+205, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+270, y+175, 20, drawEnemy));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Enemy(x+10, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+75, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+140, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+205, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Coin(x+270, y+230, 10, drawCoin));
}
waves[55].width = 280;
waves[55].height = 240;

// Width = 280, Height = 240
waves[56] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+205, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+270, y+10, 10, drawCoin));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Enemy(x+10, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+75, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+140, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+205, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+270, y+65, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+10, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+75, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+140, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+205, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+270, y+120, 20, drawEnemy));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Enemy(x+10, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+75, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+140, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+205, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+270, y+175, 20, drawEnemy));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Coin(x+10, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Enemy(x+75, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+140, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+205, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+270, y+230, 20, drawEnemy));
}
waves[56].width = 280;
waves[56].height = 240;

// Width = 280, Height = 240
waves[57] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+75, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+140, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+205, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+270, y+10, 10, drawCoin));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Enemy(x+10, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+75, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+140, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+205, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+270, y+65, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+10, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+75, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+140, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+205, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+270, y+120, 20, drawEnemy));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Enemy(x+10, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+75, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+140, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+205, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+270, y+175, 20, drawEnemy));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Powerup(x+10, y+230, 20, drawPowerup));
  objectQueue[y+220].push(new Enemy(x+75, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+140, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+205, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+270, y+230, 20, drawEnemy));
}
waves[57].width = 280;
waves[57].height = 240;

// Width = 260, Height = 170
waves[58] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Powerup(x+10, y+10, 20, drawPowerup));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+10, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+70, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(x+130, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+190, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Coin(x+190, y+110, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+130, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Enemy(x+190, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Coin(x+250, y+160, 10, drawCoin));
}
waves[58].width = 260;
waves[58].height = 170;

//Width = 260. Height = 170
waves[59] = function(x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+130, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+10, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+70, y+110, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Coin(x+190, y+160, 10, drawCoin));
}
waves[59].width = 260;
waves[59].height = 170;

//Width = 260. Height = 170
waves[60] = function(x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+250, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+130, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+10, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+70, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+190, y+160, 20, drawEnemy));
}
waves[60].width = 260;
waves[60].height = 170;

//Width = 260. Height = 170
waves[61] = function(x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+130, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+10, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Powerup(x+70, y+110, 20, drawPowerup));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Coin(x+190, y+160, 10, drawCoin));
}
waves[61].width = 260;
waves[61].height = 170;

//Width = 260, Height = 170 
waves[62] = function(x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+250, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+10, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+130, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+250, y+110, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+10, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Coin(x+70, y+160, 10, drawCoin));
}
waves[62].width = 260;
waves[62].height = 170;

//Width = 260, Height = 170 
waves[63] = function(x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+130, y+20, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+250, y+20, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+10, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+250, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Coin(x+10, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Enemy(x+70, y+160, 20, drawEnemy));
}
waves[63].width = 260;
waves[63].height = 170;

//Width = 260, Height = 170
waves[64] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+70, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Enemy(x+130, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+10, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+250, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Coin(x+130, y+160, 10, drawCoin));
}
waves[64].width = 260;
waves[64].height = 170;

//Width = 260, Height = 170
waves[65] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+70, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Coin(x+130, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+10, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+250, y+110, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+130, y+160, 20, drawEnemy));
}
waves[65].width = 260;
waves[65].height = 170;

// Width = 320, Height = 220
waves[66] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+70, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+130, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+190, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Coin(x+190, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Enemy(x+250, y+160, 20, drawEnemy));

  objectQueue[y+200] = [];
  objectQueue[y+200].push(new Coin(x+250, y+210, 10, drawCoin));
  objectQueue[y+200].push(new Enemy(x+310, y+210, 20, drawEnemy));
}
waves[66].width = 320;
waves[66].height = 220;

// Width = 320, Height = 220
waves[67] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+70, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+130, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+130, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+190, y+110, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+190, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Coin(x+250, y+160, 10, drawCoin));

  objectQueue[y+200] = [];
  objectQueue[y+200].push(new Enemy(x+250, y+210, 20, drawEnemy));
  objectQueue[y+200].push(new Coin(x+310, y+210, 10, drawCoin));
}
waves[67].width = 320;
waves[67].height = 220;

// Width = 320, Height = 220
waves[68] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+310, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+250, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+250, y+60, 20, drawEnemy));
  objectQueue[y+50].push(new Coin(x+190, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Enemy(x+190, y+110, 20, drawEnemy));
  objectQueue[y+100].push(new Coin(x+130, y+110, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+130, y+160, 20, drawEnemy));
  objectQueue[y+150].push(new Coin(x+70, y+160, 10, drawCoin));

  objectQueue[y+200] = [];
  objectQueue[y+200].push(new Enemy(x+70, y+210, 20, drawEnemy));
  objectQueue[y+200].push(new Coin(x+10, y+210, 10, drawCoin));
}
waves[68].width = 320;
waves[68].height = 220;

// Width = 320, Height = 220
waves[69] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+310, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+250, y+60, 10, drawCoin));
  objectQueue[y+50].push(new Enemy(x+190, y+60, 20, drawEnemy));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+190, y+110, 10, drawCoin));
  objectQueue[y+100].push(new Enemy(x+130, y+110, 20, drawEnemy));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Coin(x+130, y+160, 10, drawCoin));
  objectQueue[y+150].push(new Enemy(x+70, y+160, 20, drawEnemy));

  objectQueue[y+200] = [];
  objectQueue[y+200].push(new Coin(x+70, y+210, 10, drawCoin));
  objectQueue[y+200].push(new Enemy(x+10, y+210, 20, drawEnemy));
}
waves[69].width = 320;
waves[69].height = 220;

// Width = 380, Height = 240
waves[70] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+250, y+10, 10, drawCoin));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Coin(x+70, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+130, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+190, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+250, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+310, y+65, 10, drawCoin));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Coin(x+10, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+70, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+310, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+370, y+120, 10, drawCoin));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Coin(x+70, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+130, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+190, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+250, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+310, y+175, 10, drawCoin));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Coin(x+130, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Coin(x+190, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Coin(x+250, y+230, 10, drawCoin));
}
waves[70].width = 380;
waves[70].height = 240;

// Width = 380, Height = 240
waves[71] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawEnemy));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Enemy(x+70, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+130, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Coin(x+190, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Coin(x+250, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+310, y+65, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+10, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+70, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Coin(x+310, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+370, y+120, 20, drawEnemy));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Enemy(x+70, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+130, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Coin(x+190, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Coin(x+250, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+310, y+175, 20, drawEnemy));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Enemy(x+130, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+190, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+250, y+230, 20, drawEnemy));
}
waves[71].width = 380;
waves[71].height = 240;

// Width = 320, Height = 295
waves[72] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Coin(x+70, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+130, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Enemy(x+190, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+250, y+65, 10, drawCoin));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Coin(x+10, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+70, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Enemy(x+250, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+310, y+120, 10, drawCoin));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Coin(x+10, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+70, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Enemy(x+250, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+310, y+175, 10, drawCoin));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Coin(x+70, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Enemy(x+130, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Enemy(x+190, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Coin(x+250, y+230, 10, drawCoin));

  objectQueue[y+275] = [];
  objectQueue[y+275].push(new Coin(x+130, y+285, 10, drawCoin));
  objectQueue[y+275].push(new Coin(x+190, y+285, 10, drawCoin));
}
waves[72].width = 320;
waves[72].height = 295;

// Width = 320, Height = 295
waves[73] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawEnemy));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Enemy(x+70, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+130, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Coin(x+190, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+250, y+65, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+10, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+70, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Coin(x+250, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+310, y+120, 20, drawEnemy));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Enemy(x+10, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+70, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Coin(x+250, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+310, y+175, 20, drawEnemy));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Enemy(x+70, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Coin(x+130, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Coin(x+190, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Enemy(x+250, y+230, 20, drawEnemy));

  objectQueue[y+275] = [];
  objectQueue[y+275].push(new Enemy(x+130, y+285, 20, drawEnemy));
  objectQueue[y+275].push(new Enemy(x+190, y+285, 20, drawEnemy));
}
waves[73].width = 320;
waves[73].height = 295;

// Width = 320, Height = 460
waves[74] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+190, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+250, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+310, y+10, 10, drawCoin));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Coin(x+130, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+190, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+250, y+65, 10, drawCoin));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Coin(x+70, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+130, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+190, y+120, 10, drawCoin));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Coin(x+10, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+70, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+130, y+175, 10, drawCoin));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Enemy(x+10, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Coin(x+70, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Enemy(x+130, y+230, 20, drawEnemy));

  objectQueue[y+275] = [];
  objectQueue[y+275].push(new Coin(x+10, y+285, 10, drawCoin));
  objectQueue[y+275].push(new Enemy(x+70, y+285, 20, drawEnemy));
  objectQueue[y+275].push(new Coin(x+130, y+285, 10, drawCoin));

  objectQueue[y+330] = [];
  objectQueue[y+330].push(new Coin(x+70, y+340, 10, drawCoin));
  objectQueue[y+330].push(new Enemy(x+130, y+340, 20, drawEnemy));
  objectQueue[y+330].push(new Coin(x+190, y+340, 10, drawCoin));

  objectQueue[y+385] = [];
  objectQueue[y+385].push(new Coin(x+130, y+395, 10, drawCoin));
  objectQueue[y+385].push(new Enemy(x+190, y+395, 20, drawEnemy));
  objectQueue[y+385].push(new Coin(x+250, y+395, 10, drawCoin));

  objectQueue[y+440] = [];
  objectQueue[y+440].push(new Coin(x+190, y+450, 10, drawCoin));
  objectQueue[y+440].push(new Enemy(x+250, y+450, 20, drawEnemy));
  objectQueue[y+440].push(new Coin(x+310, y+450, 10, drawCoin));
}
waves[74].width = 320;
waves[74].height = 460;

// Width = 320, Height = 460
waves[75] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+190, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+250, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+310, y+10, 20, drawEnemy));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Enemy(x+130, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+190, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+250, y+65, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+70, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+130, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+190, y+120, 20, drawEnemy));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Enemy(x+10, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+70, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+130, y+175, 20, drawEnemy));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Coin(x+10, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Enemy(x+70, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Coin(x+130, y+230, 10, drawCoin));

  objectQueue[y+275] = [];
  objectQueue[y+275].push(new Enemy(x+10, y+285, 20, drawEnemy));
  objectQueue[y+275].push(new Coin(x+70, y+285, 10, drawCoin));
  objectQueue[y+275].push(new Enemy(x+130, y+285, 20, drawEnemy));

  objectQueue[y+330] = [];
  objectQueue[y+330].push(new Enemy(x+70, y+340, 20, drawEnemy));
  objectQueue[y+330].push(new Coin(x+130, y+340, 10, drawCoin));
  objectQueue[y+330].push(new Enemy(x+190, y+340, 20, drawEnemy));

  objectQueue[y+385] = [];
  objectQueue[y+385].push(new Enemy(x+130, y+395, 20, drawEnemy));
  objectQueue[y+385].push(new Coin(x+190, y+395, 10, drawCoin));
  objectQueue[y+385].push(new Enemy(x+250, y+395, 20, drawEnemy));

  objectQueue[y+440] = [];
  objectQueue[y+440].push(new Enemy(x+190, y+450, 20, drawEnemy));
  objectQueue[y+440].push(new Coin(x+250, y+450, 10, drawCoin));
  objectQueue[y+440].push(new Enemy(x+310, y+450, 20, drawEnemy));
}
waves[75].width = 320;
waves[75].height = 460;

//Width = 320, Height = 460
waves[76] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+70, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+130, y+10, 10, drawCoin));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Coin(x+70, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+130, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+190, y+65, 10, drawCoin));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Coin(x+130, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+190, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+250, y+120, 10, drawCoin));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Coin(x+190, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+250, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+310, y+175, 10, drawCoin));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Enemy(x+190, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Coin(x+250, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Enemy(x+310, y+230, 20, drawEnemy));

  objectQueue[y+275] = [];
  objectQueue[y+275].push(new Coin(x+190, y+285, 10, drawCoin));
  objectQueue[y+275].push(new Enemy(x+250, y+285, 20, drawEnemy));
  objectQueue[y+275].push(new Coin(x+310, y+285, 10, drawCoin));

  objectQueue[y+330] = [];
  objectQueue[y+330].push(new Coin(x+130, y+340, 10, drawCoin));
  objectQueue[y+330].push(new Enemy(x+190, y+340, 20, drawEnemy));
  objectQueue[y+330].push(new Coin(x+250, y+340, 10, drawCoin));

  objectQueue[y+385] = [];
  objectQueue[y+385].push(new Coin(x+70, y+395, 10, drawCoin));
  objectQueue[y+385].push(new Enemy(x+130, y+395, 20, drawEnemy));
  objectQueue[y+385].push(new Coin(x+190, y+395, 10, drawCoin));

  objectQueue[y+440] = [];
  objectQueue[y+440].push(new Coin(x+10, y+450, 10, drawCoin));
  objectQueue[y+440].push(new Enemy(x+70, y+450, 20, drawEnemy));
  objectQueue[y+440].push(new Coin(x+130, y+450, 10, drawCoin));
}
waves[76].width = 320;
waves[76].height = 460;

//Width = 320, Height = 460
waves[77] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+70, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+130, y+10, 20, drawEnemy));

  objectQueue[y+55] = [];
  objectQueue[y+55].push(new Enemy(x+70, y+65, 20, drawEnemy));
  objectQueue[y+55].push(new Coin(x+130, y+65, 10, drawCoin));
  objectQueue[y+55].push(new Enemy(x+190, y+65, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+130, y+120, 20, drawEnemy));
  objectQueue[y+110].push(new Coin(x+190, y+120, 10, drawCoin));
  objectQueue[y+110].push(new Enemy(x+250, y+120, 20, drawEnemy));

  objectQueue[y+165] = [];
  objectQueue[y+165].push(new Enemy(x+190, y+175, 20, drawEnemy));
  objectQueue[y+165].push(new Coin(x+250, y+175, 10, drawCoin));
  objectQueue[y+165].push(new Enemy(x+310, y+175, 20, drawEnemy));

  objectQueue[y+220] = [];
  objectQueue[y+220].push(new Coin(x+190, y+230, 10, drawCoin));
  objectQueue[y+220].push(new Enemy(x+250, y+230, 20, drawEnemy));
  objectQueue[y+220].push(new Coin(x+310, y+230, 10, drawCoin));

  objectQueue[y+275] = [];
  objectQueue[y+275].push(new Enemy(x+190, y+285, 20, drawEnemy));
  objectQueue[y+275].push(new Coin(x+250, y+285, 10, drawCoin));
  objectQueue[y+275].push(new Enemy(x+310, y+285, 20, drawEnemy));

  objectQueue[y+330] = [];
  objectQueue[y+330].push(new Enemy(x+130, y+340, 20, drawEnemy));
  objectQueue[y+330].push(new Coin(x+190, y+340, 10, drawCoin));
  objectQueue[y+330].push(new Enemy(x+250, y+340, 20, drawEnemy));

  objectQueue[y+385] = [];
  objectQueue[y+385].push(new Enemy(x+70, y+395, 20, drawEnemy));
  objectQueue[y+385].push(new Coin(x+130, y+395, 10, drawCoin));
  objectQueue[y+385].push(new Enemy(x+190, y+395, 20, drawEnemy));

  objectQueue[y+440] = [];
  objectQueue[y+440].push(new Enemy(x+10, y+450, 20, drawEnemy));
  objectQueue[y+440].push(new Coin(x+70, y+450, 10, drawCoin));
  objectQueue[y+440].push(new Enemy(x+130, y+450, 20, drawEnemy));
}
waves[77].width = 320;
waves[77].height = 460;

// Barrier Waves
// Each wave takes a y coordinate of the top of the barrier
// Each wave has a height, which is the length of the barrier
var barWaves = [];

// Height = 160
barWaves[0] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 160, drawBarrier));

  objectQueue[y+20] = [];
  objectQueue[y+20].push(new Side(150, y+90, 70, true, drawSideA));
  objectQueue[y+20].push(new Side(350, y+90, 70, false, drawSideB));
}
barWaves[0].height = 160;

// Height = 160
barWaves[1] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 160, drawBarrier));

  objectQueue[y+20] = [];
  objectQueue[y+20].push(new Side(150, y+90, 70, false, drawSideA));
  objectQueue[y+20].push(new Side(350, y+90, 70, true, drawSideB));
}
barWaves[1].height = 160;

// Height = 160
barWaves[2] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 160, drawBarrier));

  objectQueue[y+20] = [];
  objectQueue[y+20].push(new Side(150, y+90, 70, false, drawSideB));
  objectQueue[y+20].push(new Side(350, y+90, 70, true, drawSideA));
}
barWaves[2].height = 160;

// Height = 160
barWaves[3] = function (y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Barrier(y, 160, drawBarrier));

  objectQueue[y+20] = [];
  objectQueue[y+20].push(new Side(150, y+90, 70, true, drawSideB));
  objectQueue[y+20].push(new Side(350, y+90, 70, false, drawSideA));
}
barWaves[3].height = 160;

function narrowSides(y) {
  levelSides[nextInd].next = y;
  levelSides[y] = { x: SIDE_WIDTH, next: y + 20 };
  levelSides[y + 20] = { x: WIDTH/2-SHIP_WIDTH/2-1, next: y + 40 };
  levelSides[y + 40] = { x: SIDE_WIDTH, next: undefined };
  nextInd = y + 40;

  recordState.push(y + 170);
}

function randomPos(waveNumber) {
  var random = Alea();
  return 60 + Math.round(random() * (WIDTH-waves[waveNumber].width-120));
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
