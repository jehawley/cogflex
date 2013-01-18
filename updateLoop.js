// updateLoop.js
// Contains game loops for all of the screens

function startScreen() {
  renderStartScreen();
}

function instructionScreen() {
  renderInstructionScreen();
}

function instructionScreen2() {
  renderInstructionScreen2();
}

function chooseLevelScreen() {
  renderChooseLevelScreen();
}

function levelScreen() {
  var i;

  if (paused) {
    renderPauseScreen();
    return;
  }

  // 32 = Space
  if (keysDown[32] &&
      (GameState.powerupCount > 0) &&
      !powerupUsed) {
    powerupUsed = true;
    GameState.powerupCount -= 1;
    audioData.powerupUse.currentTime = 0;
    audioData.powerupUse.play();
    powerupFuns[chosenLevel]();
  }

  player.posY += player.speed / FPS;
  player.topHeight = player.posY;
  player.bottomHeight = player.posY + SHIP_WIDTH / 2;

  // left arrow
  if (keysDown[37]) {
    // For ship moving up
    player.posX += SHIP_SPEED / FPS;
  }
  // right arrow
  if (keysDown[39]) {
    // For ship moving up
    player.posX += -SHIP_SPEED / FPS;
  }
  player.intersect();
  for (i = 0;
       objectIndices[i] < Math.ceil(player.bottomHeight);
       ++i) {
    objectQueue[objectIndices[i]].forEach(gameObjectInteract);
  }

  if ((recordState.length) >= 0 && (recordState[0] <= player.posY)) {
    sideImageCount = sideImageCount + 1;
    if (sideImageChangeover &&
        sideImageCount >= sideImageChangeover[0]) {
      sideImageCurr = (sideImageCurr + 1) %
                      DISTINCT_SIDE_COUNT[chosenLevel];
      sideImageChangeover.shift();
    }

    if (player.posX < WIDTH / 2) {
      sideChosenRecord[chosenLevel].push(0);
    } else {
      sideChosenRecord[chosenLevel].push(1);
    }
    recordState.shift();
  }

  renderLevelScreen();

  if (player.bottomHeight > levelEnd) {
    changeScreen(resultsScreen, handleResultsScreen);
  }
}

function gameObjectInteract(element, index, array) {
           if (element.bottomHeight <
               (player.topHeight - OFFSET)) {
             delete array[index];
           }
           if (element.intersect()) {
             if (element.length) {
               if (player.bottomHeight <
                   (element.topHeight + SHIP_DESCENT/FPS + 0.1)) {
                 player.posY = player.posY - 250;
                 GameState.warningState += 1;
                 if (GameState.warningState >
                     MAX_WARNINGS) {
                   player.posY = levelEnd + 500;
                   player.topHeight = player.posY;
                   player.bottomHeight = player.posY + SHIP_WIDTH/2;
                   forcedLevelQuit = true;
                 } else {
                   warningFlashState = 65;
                   audioData.barrierWarning.currentTime=0;
                   audioData.barrierWarning.play();
                 }
               } else {
                 if (player.posX < (WIDTH / 2)) {
                   player.posX = WIDTH - SHIP_WIDTH - BAR_WIDTH;
                   player.posX *= 0.5;
                 } else {
                   player.posX = WIDTH + SHIP_WIDTH + BAR_WIDTH;
                   player.posX *= 0.5;
                 }
               }
             } else if (element.width) {
               GameState.powerupCount += 1;
               powerupGetState = 15;
               audioData.powerupGet.currentTime = 0;
               audioData.powerupGet.play();
               delete array[index];
             } else if (element.sideLength) {
               if (powerupUseState <= 0 || chosenLevel !== 2) {
                 GameState.multiplierBar = 0;
                 GameState.score -= BASE_POINTS;
                 if (GameState.score < 0) {
                   GameState.score = 0;
                 }
                 if (GameState.multiplier > 1) {
                   GameState.multiplier -= 1;
                 }
                 redFlashState = 15;
                 audioData.buzzSmall.currentTime = 0;
                 audioData.buzzSmall.play();
               } else {
                 powerupUseState -= 1;
               }
               delete array[index];
             } else if (typeof element.good !== "undefined") {
               if (element.good) {
                 GameState.score += (BASE_POINTS * GameState.multiplier * 5);
                 GameState.multiplierBar += 2 * MULT_INCR;
                 while (GameState.multiplierBar >=
                        (GameState.multiplier*MULT_MAX)) {
                   GameState.multiplierBar -= GameState.multiplier * MULT_MAX;
                   GameState.multiplier += 1;
                 }
                 starQueue.push( { xS: WIDTH - element.posX - 20,
                                   yS: HEIGHT - element.posY +
                                       player.posY - OFFSET,
                                   frame: 0,
                                   x: WIDTH-element.posX,
                                   y: HEIGHT - element.posY +
                                      player.posY - OFFSET,
                                   p: 3,
                                   a: 10, 
                                   s: 35} );
                 starQueue.push( { xS: WIDTH - element.posX - 10,
                                   yS: HEIGHT - element.posY +
                                       player.posY - OFFSET,
                                   frame: 0,
                                   x: WIDTH-element.posX,
                                   y: HEIGHT - element.posY +
                                       player.posY - OFFSET, 
                                   p: 2, 
                                   a: 50,
                                   s: 36 } );
                 starQueue.push( { xS: WIDTH - element.posX,
                                   yS: HEIGHT - element.posY +
                                       player.posY - OFFSET,
                                   frame: 0,
                                   x: WIDTH - element.posX,
                                   y: HEIGHT - element.posY +
                                      player.posY - OFFSET,
                                   p: 3,
                                   a: 80,
                                   s: 37} );
                 starQueue.push( { xS: WIDTH - element.posX + 10,
                                   yS: HEIGHT - element.posY +
                                       player.posY - OFFSET,
                                   frame: 0,
                                   x: WIDTH-element.posX,
                                   y: HEIGHT - element.posY +
                                      player.posY - OFFSET, 
                                   p: 2,
                                   a: -10,
                                   s: 38 } );
                 starQueue.push( { xS: WIDTH - element.posX + 20,
                                   yS: HEIGHT - element.posY +
                                       player.posY - OFFSET,
                                   frame: 0,
                                   x: WIDTH-element.posX,
                                   y: HEIGHT - element.posY +
                                      player.posY - OFFSET, 
                                   p: 3,
                                   a: -60,
                                   s: 39 } );
                 audioData.sparkleBig.currentTime = 0;
                 audioData.sparkleBig.play();
               } else {
                 GameState.multiplierBar = 0;
                 if (GameState.multiplier > 1) {
                   GameState.multiplier -= 1;
                 }
                 xFlashState = 30;
                 GameState.score -= 2 * BASE_POINTS;
                 if (GameState.score < 0) {
                   GameState.score = 0;
                 }
                 audioData.buzzBig.currentTime = 0;
                 audioData.buzzBig.play();
               }
               delete array[index];
             } else if (element.radius) {
               GameState.score += BASE_POINTS * GameState.multiplier;
               GameState.multiplierBar += MULT_INCR;
               while (GameState.multiplierBar >=
                      (GameState.multiplier * MULT_MAX)) {
                 GameState.multiplierBar -= GameState.multiplier * MULT_MAX;
                 GameState.multiplier += 1;
               }
               starQueue.push( { xS: WIDTH - element.posX,
                                 yS: HEIGHT - element.posY +
                                     player.posY - OFFSET, 
                                 frame: 0,
                                 x: WIDTH - element.posX,
                                 y: HEIGHT - element.posY +
                                    player.posY-OFFSET,
                                 p: 3,
                                 a: 25,
                                 s: 37} );
               audioData.sparkleSmall.currentTime = 0;
               audioData.sparkleSmall.play();
               delete array[index];
             }
           }
  }


powerupFuns = [];

powerupFuns[1] = function () {
  powerupUseState = 14;
  for (i = 0;
       i < Math.ceil(player.bottomHeight - OFFSET + HEIGHT);
       ++i) {
    if (objectQueue[i]) {
      objectQueue[i].forEach(function (element, index, array) {
                               if (element.sideLength) {
                                 delete array[index];
                               }
                             } );
    }
  }
}

powerupFuns[2] = function () {
  powerupUseState = 3;
}

powerupFuns[3] = function () {
  powerupUseState = 200;
  player.speed = 130;
}

powerupFuns[4] = function() {
  powerupUseState = 40;

  GameState.multiplierBar += MULT_MAX * GameState.multiplier;
  while (GameState.multiplierBar >=
    (GameState.multiplier * MULT_MAX)) {
    GameState.multiplierBar -=
    GameState.multiplier * MULT_MAX;
    GameState.multiplier += 1;
  }
}

function resultsScreen() {
  renderResultsScreen();
}
