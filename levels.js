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

// A PRNG for generating random positions
var randomPosGen = Alea();

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
         testTrials[chosenLevel].length > 1) {
    tsSlice = tsSlice.concat(testSide.slice(0, testTrials[chosenLevel][0] +
                                               testTrials[chosenLevel][1]));
    testSide = testSide.slice(testTrials[chosenLevel][0] +
                              testTrials[chosenLevel][1]);
    testTrials[chosenLevel] = testTrials[chosenLevel].slice(2);
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
      // TODO? : Fix this hack - only works for initial config
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
  var i;
  for (i = 0; i < levelLength; ++i) {
    waveSeq[i] = { w: [78],
                   wa:[randomPos(78)] };
  }
}

buildLevelWaves[2] = function (waveSeq, levelLength) {
  // The fractions of the level corresponding to each set of waves
  // sector lengths : [0.4, 0.5, 0.1];
  var sectors = [0.4, 0.9];
  var secStops = sectors.map(function (x) {
                               return Math.floor(x * levelLength);
                             } );
  var i;
  var waveQueues = [ [79],
                     [[79, 79], [79, 79], [79]],
                     [[79, 79, 79]] ];

  for (i = 0; i < secStops[0]; ++i) {
    num = waveQueues[0][0];
    waveSeq[i] = { w: [num],
                   wa: [randomPos(num)] };
    waveQueues[0].push(waveQueues[0].shift());
  }
  shuffleArray(waveSeq, 0, secStops[0]);

  for (i = secStops[0]; i < secStops[1]; ++i) {
    num = waveQueues[1][0];
    if (num.length === 1) {
      waveSeq[i] = { w: num,
                     wa: [randomPos(num[0])] };
    } else {
      waveSeq[i] = { w: num,
                     wa: [randomPos(num[0]), randomPos(num[1])] };
    }
    waveQueues[1].push(waveQueues[1].shift());
  }
  shuffleArray(waveSeq, secStops[0], secStops[1]);

  for (i = secStops[1]; i < levelLength; ++i) {
    num = waveQueues[2][0]
    waveSeq[i] = { w: num,
                   wa: [randomPos(num[0]),
                        randomPos(num[1]),
                        randomPos(num[2])] };
    waveQueues[2].push(waveQueues[2].shift());
  }
  shuffleArray(waveSeq, secStops[1], levelLength);
}

buildLevelWaves[3] = function (waveSeq, levelLength) {
  // The fractions of the level corresponding to each set of waves
  // sector lengths : [0.3, 0.3, 0.4];
  var sectors = [0.3, 0.6];
  var secStops = sectors.map(function (x) {
                               return Math.floor(x * levelLength);
                             } );
  var i;
  var waveQueues = [ [[80], [81]],
                     [[82], [83]],
                     [[80, 82], [80, 83], [82, 83], [81, 82], [83, 82]] ];

  for (i = 0; i < secStops[0]; ++i) {
    num = waveQueues[0][0];
    waveSeq[i] = { w: num,
                   wa: [randomPos(num[0])] };
    waveQueues[0].push(waveQueues[0].shift());
  }
  shuffleArray(waveSeq, 0, secStops[0]);

  for (i = secStops[0]; i < secStops[1]; ++i) {
    num = waveQueues[1][0];
    waveSeq[i] = { w: num,
                   wa: [randomPos(num[0])] };
    waveQueues[1].push(waveQueues[1].shift());
  }
  shuffleArray(waveSeq, secStops[0], secStops[1]);

  for (i = secStops[1]; i < levelLength; ++i) {
    num = waveQueues[2][0];
    waveSeq[i] = { w: num,
                   wa: [randomPos(num[0]), randomPos(num[1])] };
    waveQueues[2].push(waveQueues[2].shift());
  }
  shuffleArray(waveSeq, secStops[1], levelLength);
}

buildLevelWaves[4] = function (waveSeq, levelLength) {
  // The fractions of the level corresponding to each set of waves
  // sector lengths : [0.2, 0.2, 0.2, 0.2, 0.2];
  var sectors = [0.2, 0.4, 0.6, 0.8];
  var secStops = sectors.map(function (x) {
                               return Math.floor(x * levelLength);
                             } );
  var i;
  var waveQueues = [ [[84, 84], [85, 85], [84, 85]],
                     [[88], [89]],
                     [[88], [89], [86], [87], [86]],
                     [[90], [91], [92], [93]],
                     [[90, 91], [90, 92], [91, 92], [92, 93], [90, 93]] ];
  for (i = 0; i < secStops[0]; ++i) {
    num = waveQueues[0][0];
    waveSeq[i] = { w: num,
                   wa: [randomPos(num[0]), randomPos(num[1])] };
    waveQueues[0].push(waveQueues[0].shift());
  }
  shuffleArray(waveSeq, 0, secStops[0]);
  for (i = secStops[0]; i < secStops[1]; ++i) {
    num = waveQueues[1][0];
    waveSeq[i] = { w: num,
                   wa: [randomPos(num[0])] };
    waveQueues[1].push(waveQueues[1].shift());
  }
  shuffleArray(waveSeq, secStops[0], secStops[1]);
  for (i = secStops[1]; i < secStops[2]; ++i) {
    num = waveQueues[2][0];
    waveSeq[i] = { w: num,
                   wa: [randomPos(num[0])] };
    waveQueues[2].push(waveQueues[2].shift());
  }
  shuffleArray(waveSeq, secStops[1], secStops[2]);
  for (i = secStops[2]; i < secStops[3]; ++i) {
    num = waveQueues[3][0];
    waveSeq[i] = { w: num,
                   wa: [randomPos(num[0])] };
    waveQueues[3].push(waveQueues[3].shift());
  }
  shuffleArray(waveSeq, secStops[2], secStops[3]);
  for (i = secStops[3]; i < levelLength; ++i) {
    num = waveQueues[4][0];
    waveSeq[i] = { w: num,
                   wa: [randomPos(num[0]), randomPos(num[1])] };
    waveQueues[4].push(waveQueues[4].shift());
  }
  shuffleArray(waveSeq, secStops[3], levelLength);
}

buildLevelWaves[5] = function (waveSeq, levelLength) {
  // The fractions of the level corresponding to each set of waves
  // sector lengths: [0.33 0.34 0.33;
  var sectors = [0.33, 0.67];
  var secStops = sectors.map(function (x) {
                               return Math.floor(x * levelLength);
                             } );
  var i;
  var waveQueues = [ [108, 109, 110, 111, 112, 113, 114, 108, 109],
                     [118, 119, 120, 121, 122, 123, 124],
                     [[108, 116], [110, 117], [109, 116], [112, 124],
                      [111, 117], [124, 118], [120, 124], [124, 116] ]
                   ];
  for (i = 0; i < secStops[0]; ++i) {
    num = waveQueues[0][0];
    waveSeq[i] = { w: [num],
                   wa: [randomPos(num)] };
    waveQueues[0].push(waveQueues[0].shift());
  }
  shuffleArray(waveSeq, 0, secStops[0]);

  for (i = secStops[0]; i < secStops[1]; ++i) {
    num = waveQueues[1][0];
    waveSeq[i] = { w: [num],
                   wa: [randomPos(num)] };
    waveQueues[1].push(waveQueues[1].shift());
  }
  shuffleArray(waveSeq, secStops[0], secStops[1]);

  for (i = secStops[1]; i < levelLength - 1; ++i) {
    num = waveQueues[2][0];
    waveSeq[i] = { w: num,
                   wa: [randomPos(num[0]), randomPos(num[1])] };
    waveQueues[2].push(waveQueues[2].shift());
  }
  shuffleArray(waveSeq, secStops[1], i);

  waveSeq[i] = { w: [115],
                 wa: [randomPos(115)] };
}

buildLevelWaves[6] = function (waveSeq, levelLength) {
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

buildLevelWaves[7] = function (waveSeq, levelLength) {
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

buildLevelWaves[8] = function (waveSeq, levelLength) {
  // The fractions of the level corresponding to each set of waves
  // sector lengths: [0.1, 0.2, 0.7];
  var sectors = [0.1, 0.3];
  var secStops = sectors.map(function (x) {
                               return Math.floor(x * levelLength);
                             } );
  var i;
  var waveQueues = [ [100, 101, 102, 100, 101, 100, 101],
                     [[105, 104], [104, 105], [106, 105], [104, 96], [105, 97]],
                     [[98, 97], [94, 96], [95, 96], [96, 97], [97, 96],
                      [99, 96], [100, 97], [103, 106], [106, 103], [98, 98]]
                   ];

  for (i = 0; i < secStops[0]; ++i) {
    num = waveQueues[0][0];
    waveSeq[i] = { w: [num],
                   wa: [randomPos(num)] };
    waveQueues[0].push(waveQueues[0].shift());
  }
  shuffleArray(waveSeq, 0, secStops[0]);

  for (i = secStops[0]; i < secStops[1]; ++i) {
    num = waveQueues[1][0];
    waveSeq[i] = { w: num,
                   wa: [randomPos(num[0]), randomPos(num[1])] };
    waveQueues[1].push(waveQueues[1].shift());
  }
  shuffleArray(waveSeq, secStops[0], secStops[1]);

  for (i = secStops[1]; i < levelLength - 1; ++i) {
    num = waveQueues[2][0];
    waveSeq[i] = { w: num,
                   wa: [randomPos(num[0]), randomPos(num[1])] };
    waveQueues[2].push(waveQueues[2].shift());
  }
  shuffleArray(waveSeq, secStops[1], i);

  waveSeq[i] = { w: [96, 97, 96, 97, 96, 97, 97, 96],
                 wa: [randomPos(96), randomPos(97), randomPos(96),
                      randomPos(97), randomPos(96), randomPos(97),
                      randomPos(97), randomPos(96)] };
}

buildLevelWaves[9] = function (waveSeq, levelLength) {
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

buildLevelWaves[10] = function (waveSeq, levelLength) {
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

// levels: The total numbers of levels
// success: The probability of success in each region, 0-indexed by level.
// trials: The number of trials in each region, 0-indexed by level.
// reverse: If true, the current trial is a reversal of the previous trial
//          Otherwise, it is independent. 0-Indexed by level.
function initTestValues(levels, success, trials, reverse) {
  testTrials = [[]].concat(trials);
  var l, i, j;
  var random = Alea();
  var side = Math.round(random());
  var sidesWithData = [];

  sideImageCount = 0;
  sideImageCurr = 0;
  sideImageChangeover = [[]];

  for (l = 0; l < levels; ++l) {
    sideImageChangeover.push([]);
    for (i = 0; i < success[l].length; ++i) {
      if (reverse[l][i]) {
        side = 1 - side;
      } else {
        side = Math.round(random());
        if (i > 0) {
          sideImageChangeover[l + 1].push(trials[l].slice(0, i).reduce(
              function (x, y) {
                return x + y;
              },
              0));
        }
      }
      for (j = 0; j < trials[l][i]; ++j) {
        successP[l + 1].push(success[l][i]);
        reversed[l + 1].push(reverse[l][i]);
        correctSideRecord[l + 1].push(side);
        if (j < success[l][i] * trials[l][i]) {
          sidesWithData.push(side);
        } else {
          sidesWithData.push(1 - side);
        }
      }
      shuffleArray(sidesWithData, 0, sidesWithData.length);
      winLossRecord[l + 1] = winLossRecord[l + 1].concat(sidesWithData); 
      testSide = testSide.concat(sidesWithData);
      sidesWithData = [];
    }
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

// Width = 10, Height = 10
waves[78] = function (x, y) {
}
waves[78].width = 10;
waves[78].height = 10;

// Width = 20, Height = 20
waves[79] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
}
waves[79].width = 20;
waves[79].height = 20;

// Width = 60, Height = 20
waves[80] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+50, y+10, 20, drawEnemy));
}
waves[80].width = 60;
waves[80].height = 20;

// Width = 60, Height = 20
waves[81] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+50, y+10, 10, drawCoin));
}
waves[81].width = 60;
waves[81].height = 20;

// Width = 20, Height = 70
waves[82] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Enemy(x+10, y+60, 20, drawEnemy));
}
waves[82].width = 20;
waves[82].height = 70;

// Width = 20, Height = 70
waves[83] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+10, y+60, 10, drawCoin));
}
waves[83].width = 20;
waves[83].height = 70;

// Width = 70, Height = 80
waves[84] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+60, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+60, y+70, 10, drawCoin));
}
waves[84].width = 70;
waves[84].height = 80;

// Width = 70, Height = 80
waves[85] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+60, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+60, y+70, 20, drawEnemy));
}
waves[85].width = 70;
waves[85].height = 80;

// Width = 120, Height = 80
waves[86] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+60, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+60, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+110, y+70, 20, drawEnemy));
}
waves[86].width = 120;
waves[86].height = 80;

// Width = 120, Height = 80
waves[87] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+60, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+110, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+60, y+70, 10, drawCoin));
}
waves[87].width = 120;
waves[87].height = 80;

// Width = 120, Height = 90
waves[88] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+60, y+10, 10, drawCoin));

  objectQueue[y+70] = [];
  objectQueue[y+70].push(new Enemy(x+10, y+80, 20, drawEnemy));
  objectQueue[y+70].push(new Enemy(x+60, y+80, 20, drawEnemy));
  objectQueue[y+70].push(new Enemy(x+110, y+80, 20, drawEnemy));
}
waves[88].width = 120;
waves[88].height = 90;

// Width = 120, Height = 90
waves[89] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+60, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+110, y+10, 20, drawEnemy));

  objectQueue[y+70] = [];
  objectQueue[y+70].push(new Coin(x+60, y+80, 10, drawCoin));
}
waves[89].width = 120;
waves[89].height = 90;

// Width = 220, Height = 80
waves[90] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+60, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+60, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+110, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+160, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+210, y+70, 20, drawEnemy));
}
waves[90].width = 220;
waves[90].height = 80;

// Width = 220, Height = 80
waves[91] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+160, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+60, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+110, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+160, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Enemy(x+210, y+70, 20, drawEnemy));
}
waves[91].width = 220;
waves[91].height = 80;

// Width = 220, Height = 80
waves[92] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+60, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+110, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+160, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+210, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+60, y+70, 10, drawCoin));
}
waves[92].width = 220;
waves[92].height = 80;

// Width = 220, Height = 80
waves[93] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+60, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+110, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+160, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+210, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+160, y+70, 10, drawCoin));
}
waves[93].width = 220;
waves[93].height = 80;

// Width = 380, Height = 180
waves[94] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));

  objectQueue[y+40] = [];
  objectQueue[y+40].push(new Enemy(x+180, y+50, 20, drawEnemy));

  objectQueue[y+80] = [];
  objectQueue[y+80].push(new Coin(x+370, y+90, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+180, y+130, 20, drawEnemy));

  objectQueue[y+160] = [];
  objectQueue[y].push(new Coin(x+10, y+170, 10, drawCoin));
}
waves[94].width = 380;
waves[94].height = 180;

// Width = 380, Height = 180
waves[95] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+370, y+10, 10, drawCoin));

  objectQueue[y+40] = [];
  objectQueue[y+40].push(new Enemy(x+180, y+50, 20, drawEnemy));

  objectQueue[y+80] = [];
  objectQueue[y+80].push(new Coin(x+10, y+90, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+180, y+130, 20, drawEnemy));

  objectQueue[y+160] = [];
  objectQueue[y+160].push(new Coin(x+370, y+170, 10, drawCoin));
}
waves[95].width = 380;
waves[95].height = 180;

// Width = 370, Height = 20
waves[96] = function(x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+60, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+110, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+160, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+210, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+260, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+310, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+360, y+10, 20, drawEnemy));
}
waves[96].width = 370;
waves[96].height = 20;

// Width = 370, Height = 20
waves[97] = function(x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+60, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+110, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+160, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+210, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+260, y+10, 20, drawEnemy));
  objectQueue[y].push(new Enemy(x+310, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+360, y+10, 10, drawCoin));
}
waves[97].width = 370;
waves[97].height = 20;

// Width = 120, Height = 130
waves[98] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+60, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Powerup(x+60, y+70, 20, drawPowerup));
  objectQueue[y+60].push(new Enemy(x+110, y+70, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+60, y+120, 20, drawEnemy));
}
waves[98].width = 120;
waves[98].height = 130;

// Width = 220, Height = 200
waves[99] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+60, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+60, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+110, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Enemy(x+60, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+110, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+160, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Enemy(x+210, y+130, 20, drawEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Coin(x+60, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Coin(x+110, y+190, 10, drawCoin));
}
waves[99].width = 220;
waves[99].height = 200;

// Width = 20, Height = 50
waves[100] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));

  objectQueue[y+30] = [];
  objectQueue[y+30].push(new Enemy(x+10, y+40, 20, drawEnemy));
}
waves[100].width = 20;
waves[100].height = 50;

// Width = 20, Height = 50
waves[101] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));

  objectQueue[y+30] = [];
  objectQueue[y+30].push(new Coin(x+10, y+40, 10, drawCoin));
}
waves[101].width = 20;
waves[101].height = 50;

// Width = 20, Height = 50
waves[102] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Powerup(x+10, y+10, 20, drawPowerup));

  objectQueue[y+30] = [];
  objectQueue[y+30].push(new Enemy(x+10, y+40, 20, drawEnemy));
}
waves[102].width = 20;
waves[102].height = 50;

// Width = 120, Height = 200
waves[103] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+110, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+10, y+130, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+60, y+160, 20, drawEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Coin(x+110, y+190, 10, drawCoin));
}
waves[103].width = 120;
waves[103].height = 200;

// Width = 70, Height = 180
waves[104] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Enemy(x+60, y+10, 20, drawEnemy));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Enemy(x+10, y+70, 20, drawEnemy));
  objectQueue[y+60].push(new Coin(x+60, y+70, 10, drawCoin));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Enemy(x+35, y+120, 20, drawEnemy));

  objectQueue[y+160] = [];
  objectQueue[y+160].push(new Coin(x+35, y+170, 10, drawCoin));
}
waves[104].width = 70;
waves[104].height = 180;

// Width = 70, Height = 180
waves[105] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+60, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+60, y+70, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Coin(x+35, y+110, 10, drawCoin));

  objectQueue[y+160] = [];
  objectQueue[y+160].push(new Enemy(x+35, y+170, 20, drawEnemy));
}
waves[105].width = 70;
waves[105].height = 180;

// Waves = 70, Height = 180
waves[106] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+10, y+10, 20, drawEnemy));
  objectQueue[y].push(new Coin(x+60, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Enemy(x+60, y+70, 20, drawEnemy));

  objectQueue[y+110] = [];
  objectQueue[y+110].push(new Powerup(x+35, y+110, 20, drawPowerup));

  objectQueue[y+160] = [];
  objectQueue[y+160].push(new Enemy(x+35, y+170, 20, drawEnemy));
}
waves[106].width = 70;
waves[106].height = 180;

// Width = 120, Height = 200
waves[107] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+110, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+110, y+130, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+60, y+160, 20, drawEnemy));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Coin(x+10, y+190, 10, drawCoin));
}
waves[107].width = 120;
waves[107].height = 200;

// Width = 120, Height = 120
waves[108] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+60, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+110, y+110, 10, drawCoin));
}
waves[108].width = 120;
waves[108].height = 120;

// Width = 120, Height = 120
waves[109] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+110, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+60, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+10, y+110, 10, drawCoin));
}
waves[109].width = 120;
waves[109].height = 120;

// Width = 170, Height = 170
waves[110] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+60, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+110, y+110, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+160, y+160, 20, drawEnemy));
}
waves[110].width = 170;
waves[110].height = 170;

// Width = 170, Height = 170
waves[111] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+160, y+10, 10, drawCoin));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+110, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+60, y+110, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Enemy(x+10, y+160, 20, drawEnemy));
}
waves[111].width = 170;
waves[111].height = 170;

// Width = 120, Height = 120
waves[112] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+160, y+10, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+110, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+60, y+110, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Coin(x+10, y+160, 10, drawCoin));
}
waves[112].width = 120;
waves[112].height = 120;

// Width = 120, Height = 120
waves[113] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Enemy(x+160, y+10, 20, drawEnemy));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+110, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+60, y+110, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Coin(x+10, y+160, 10, drawCoin));
}
waves[113].width = 120;
waves[113].height = 120;

// Width = 170, Height = 120
waves[114] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Powerup(x+160, y+10, 20, drawPowerup));

  objectQueue[y+50] = [];
  objectQueue[y+50].push(new Coin(x+110, y+60, 10, drawCoin));

  objectQueue[y+100] = [];
  objectQueue[y+100].push(new Coin(x+60, y+110, 10, drawCoin));

  objectQueue[y+150] = [];
  objectQueue[y+150].push(new Coin(x+10, y+160, 10, drawCoin));
}
waves[114].width = 170;
waves[114].height = 120;

// Width = 270, Height = 500 
waves[115] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+60, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+110, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+160, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+210, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+260, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+60, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+110, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+160, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+210, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+260, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+10, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+60, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+110, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+160, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+210, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+260, y+130, 10, drawCoin));

  objectQueue[y+180] = [];
  objectQueue[y+180].push(new Coin(x+10, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Coin(x+60, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Coin(x+110, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Coin(x+160, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Coin(x+210, y+190, 10, drawCoin));
  objectQueue[y+180].push(new Coin(x+260, y+190, 10, drawCoin));

  objectQueue[y+240] = [];
  objectQueue[y+240].push(new Coin(x+10, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Coin(x+60, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Coin(x+110, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Coin(x+160, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Coin(x+210, y+250, 10, drawCoin));
  objectQueue[y+240].push(new Coin(x+260, y+250, 10, drawCoin));

  objectQueue[y+300] = [];
  objectQueue[y+300].push(new Coin(x+10, y+310, 10, drawCoin));
  objectQueue[y+300].push(new Coin(x+60, y+310, 10, drawCoin));
  objectQueue[y+300].push(new Coin(x+110, y+310, 10, drawCoin));
  objectQueue[y+300].push(new Coin(x+160, y+310, 10, drawCoin));
  objectQueue[y+300].push(new Coin(x+210, y+310, 10, drawCoin));
  objectQueue[y+300].push(new Coin(x+260, y+310, 10, drawCoin));

  objectQueue[y+360] = [];
  objectQueue[y+360].push(new Coin(x+10, y+370, 10, drawCoin));
  objectQueue[y+360].push(new Coin(x+60, y+370, 10, drawCoin));
  objectQueue[y+360].push(new Coin(x+110, y+370, 10, drawCoin));
  objectQueue[y+360].push(new Coin(x+160, y+370, 10, drawCoin));
  objectQueue[y+360].push(new Coin(x+210, y+370, 10, drawCoin));
  objectQueue[y+360].push(new Coin(x+260, y+370, 10, drawCoin));

  objectQueue[y+420] = [];
  objectQueue[y+420].push(new Coin(x+10, y+430, 10, drawCoin));
  objectQueue[y+420].push(new Coin(x+60, y+430, 10, drawCoin));
  objectQueue[y+420].push(new Coin(x+110, y+430, 10, drawCoin));
  objectQueue[y+420].push(new Coin(x+160, y+430, 10, drawCoin));
  objectQueue[y+420].push(new Coin(x+210, y+430, 10, drawCoin));
  objectQueue[y+420].push(new Coin(x+260, y+430, 10, drawCoin));

  objectQueue[y+480] = [];
  objectQueue[y+480].push(new Coin(x+10, y+490, 10, drawCoin));
  objectQueue[y+480].push(new Coin(x+60, y+490, 10, drawCoin));
  objectQueue[y+480].push(new Coin(x+110, y+490, 10, drawCoin));
  objectQueue[y+480].push(new Coin(x+160, y+490, 10, drawCoin));
  objectQueue[y+480].push(new Coin(x+210, y+490, 10, drawCoin));
  objectQueue[y+480].push(new Coin(x+260, y+490, 10, drawCoin));
}
waves[115].width = 270;
waves[115].height = 500;

// Width = 220, Height = 140
waves[116] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+110, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+110, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+10, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+60, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+110, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+160, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+210, y+130, 10, drawCoin));
}
waves[116].width = 220;
waves[116].height = 140;

// Width = 220, Height = 190
waves[117] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+110, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+110, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+10, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+60, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+110, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+160, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+210, y+130, 10, drawCoin));

  objectQueue[y+170] = [];
  objectQueue[y+170].push(new Enemy(x+85, y+180, 20, drawEnemy));
  objectQueue[y+170].push(new Enemy(x+185, y+180, 20, drawEnemy));
}
waves[117].width = 220;
waves[117].height = 190;

// Width = 170, Height = 140
waves[118] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+60, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+110, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+160, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+60, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+110, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+60, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+110, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+160, y+130, 20, drawEnemy));
}
waves[118].width = 170;
waves[118].height = 140;

// Width = 170, Height = 140
waves[119] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+60, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+110, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+160, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+60, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+110, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+60, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+110, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+160, y+130, 10, drawCoin));
}
waves[119].width = 170;
waves[119].height = 140;

// Width = 170, Height = 140
waves[120] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+60, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+110, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+160, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+10, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+60, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+110, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+60, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+110, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+160, y+130, 10, drawCoin));
}
waves[120].width = 170;
waves[120].height = 140;

// Width = 170, Height = 140
waves[121] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+60, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+110, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+60, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+110, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+160, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+10, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+60, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+110, y+130, 10, drawCoin));
}
waves[121].width = 170;
waves[121].height = 140;

// Width = 170, Height = 140
waves[122] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+60, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+110, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+60, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+110, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+160, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Coin(x+10, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+60, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Enemy(x+110, y+130, 20, drawEnemy));
}
waves[122].width = 170;
waves[122].height = 140;

// Width = 170, Height = 140
waves[123] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+60, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+110, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+60, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+110, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+160, y+70, 10, drawCoin));

  objectQueue[y+120] = [];
  objectQueue[y+120].push(new Enemy(x+10, y+130, 20, drawEnemy));
  objectQueue[y+120].push(new Coin(x+60, y+130, 10, drawCoin));
  objectQueue[y+120].push(new Coin(x+110, y+130, 10, drawCoin));
}
waves[123].width = 170;
waves[123].height = 140;

// Width = 320, Height = 80
waves[124] = function (x, y) {
  objectQueue[y] = [];
  objectQueue[y].push(new Coin(x+10, y+10, 10, drawCoin));
  objectQueue[y].push(new Coin(x+110, y+10, 10, drawCoin));
  objectQueue[y].push(new Powerup(x+210, y+10, 20, drawPowerup));
  objectQueue[y].push(new Coin(x+310, y+10, 10, drawCoin));

  objectQueue[y+60] = [];
  objectQueue[y+60].push(new Coin(x+60, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+160, y+70, 10, drawCoin));
  objectQueue[y+60].push(new Coin(x+260, y+70, 10, drawCoin));
}
waves[124].width = 320;
waves[124].height = 80;

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
  return 60 + Math.round(randomPosGen() * (WIDTH-waves[waveNumber].width-120));
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
