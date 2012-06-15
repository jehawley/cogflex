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
  renderLevel1Screen();
  // left arrow
  if (keysDown[37]) {
    player.move(-SHIP_SPEED / FPS);
  }
  // right arrow
  if (keysDown[39]) {
    player.move(SHIP_SPEED / FPS);
  }
}

function resultsScreen() {

}
