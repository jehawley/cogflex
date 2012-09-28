// eventHandlers.js
// Contains all key event handling functions for the game window
function handleStartScreen(e) {
  if ((e.type === 'keydown') &&
      (e.keyCode === 13) &&
      renderData.allImagesLoaded) {
    changeScreen(instructionScreen, handleInstructionScreen);
  }
}

function handleInstructionScreen(e) {
  if ((e.type === 'keydown') && (e.keyCode === 39)) {
    changeScreen(instructionScreen2, handleInstructionScreen2);
  }
}

function handleInstructionScreen2(e) {
  if ((e.type === 'keydown') && (e.keyCode === 37)) {
    changeScreen(instructionScreen, handleInstructionScreen);
  }
  if ((e.type === 'keydown') && (e.keyCode === 13)) {
    changeScreen(chooseLevelScreen, handleChooseLevelScreen);
  }
}

function handleChooseLevelScreen(e) {
  if ((e.type === 'keydown') && (e.keyCode === 13)) {
    buildLevel();
    forcedLevelQuit = false;
    changeScreen(levelScreen, handleLevelScreen);
  }
}

function handleChooseLevelScreenEnd(e) {

}

function handleLevelScreen(e) {
  if (e.type === 'keydown') {
    keysDown[e.keyCode] = true;
  }
  if (e.type === 'keyup') {
    keysDown[e.keyCode] = false;
    // 32 = Space
    if (e.keyCode === 32) {
      powerupUsed = false;
    }
  }
}

function handleResultsScreen(e) {
  if ((e.type === 'keydown') && (e.keyCode === 13)) {
    if (chosenLevel <= 4) {
      levelScores[chosenLevel] = GameState.score;
      chosenLevel += 1;
      GameState.reset();
      changeScreen(chooseLevelScreen, handleChooseLevelScreen);
    } else {
      // TODO: Implement something on game finish
      changeScreen(chooseLevelScreen, handleChooseLevelScreenEnd);
    }
  }
}
