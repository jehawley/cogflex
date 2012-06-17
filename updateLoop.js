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

  player.posY += player.speed / FPS;
  player.topHeight = player.posY;

  for (i = floor(player.topHeight);
       i < ceil(player.topHeight - OFFSET + HEIGHT);
       ++i) {
    objectQueue[i].forEach(function (element, index, array) {
                             element.draw();
                           });
  }

  // left arrow
  if (keysDown[37]) {
    player.move(-SHIP_SPEED / FPS);
  }
  // right arrow
  if (keysDown[39]) {
    player.move(SHIP_SPEED / FPS);
  }
  renderLevel1Screen();
}

function resultsScreen() {

}
