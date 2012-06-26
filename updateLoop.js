// updateLoop.js
// Contains game loops for all of the screens

function startScreen() {
  renderStartScreen();
}

function instructionScreen() {
  renderInstructionScreen();
}

function chooseLevelScreen() {
  renderChooseLevelScreen();
}

function levelScreen() {
  var i;

  if (player.canMove) {
    player.posY += player.speed / FPS;
    player.topHeight = player.posY;
    player.bottomHeight = player.posY + SHIP_WIDTH / 2;
  } else {
    if (!player.barrier.intersect()) {
      player.canMove = true;
      player.barrier = undefined;
    }
  }

  // left arrow
  if (keysDown[37]) {
    player.move(-SHIP_SPEED / FPS);
  }
  // right arrow
  if (keysDown[39]) {
    player.move(SHIP_SPEED / FPS);
  }
  for (i = 0;
       i < Math.ceil(player.bottomHeight);
       ++i) {
    if (objectQueue[i]) {
      objectQueue[i].forEach(function (element, index, array) {
                               if (element.bottomHeight <
                                   (player.topHeight - OFFSET)) {
                                 delete array[index];
                               }
                               if (element.intersect()) {
                                 if (element.length) {
                                   if (player.canMove) {
                                     if (player.bottomHeight <
                                         (element.topHeight + 0.05)) {
                                       player.canMove = false;
                                       player.barrier = element;
                                     } else {
                                       if (player.posX < (WIDTH / 2)) {
                                         player.posX = WIDTH -
                                                       SHIP_WIDTH -
                                                       BAR_WIDTH;
                                         player.posX *= 0.5;
                                       } else {
                                         player.posX = WIDTH +
                                                       SHIP_WIDTH +
                                                       BAR_WIDTH;
                                         player.posX *= 0.5;
                                       }
                                     }
                                   } else {
                                     // TODO? Add sliding option
                                   }
                                 } else if (element.width) {
                                   GameState.powerupCount += 1;
                                   delete array[index];
                                 } else if (element.sideLength) {
                                   GameState.multiplierBar = 0;
                                   if (GameState.multiplier > 1) {
                                     GameState.multiplier -= 1;
                                   }
                                   delete array[index];
                                 } else if (element.radius) {
                                   GameState.score += BASE_POINTS *
                                                      GameState.multiplier;
                                   GameState.multiplierBar += MULT_INCR;
                                   while (GameState.multiplierBar >
                                          (GameState.multiplier * MULT_MAX)) {
                                     GameState.multiplierBar -=
                                       GameState.multiplier * MULT_MAX;
                                     GameState.multiplier += 1;
                                   }
                                   delete array[index];
                                 }
                               }
                             });
    }
  }


  renderLevel1Screen();
  renderDataScreen();

  if (player.bottomHeight > levelEnd) {
    changeScreen(resultsScreen, handleResultsScreen);
  }
}

function resultsScreen() {
  renderResultsScreen();
}
