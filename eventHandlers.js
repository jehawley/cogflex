// eventHandlers.js
// Contains all key event handling functions for the game window
function handleStartScreen(e) {
  if ((e.type === 'keydown') && (e.keyCode === 13)) {
    changeScreen(instructionScreen, handleInstructionScreen);
  }
}

function handleInstructionScreen(e) {
  if ((e.type === 'keydown') && (String.fromCharCode(e.keyCode) === 'S')) {
    changeScreen(chooseLevelScreen, handleChooseLevelScreen);
  }
}

function handleChooseLevelScreen(e) {
  if ((e.type === 'keydown') && (e.keyCode == 13)) {
    changeScreen(levelScreen, handleLevelScreen);
    initRenderLevel1Screen();
  }
}

function handleLevelScreen(e) {
  if (e.type === 'keydown') {
    keysDown[e.keyCode] = true;
  }
  if (e.type === 'keyup') {
    keysDown[e.keyCode] = false;
    if (String.fromCharCode(e.keyCode) === 'A') {
      powerupUsed = false;
    }
  }
}

function handleResultsScreen(e) {

}
