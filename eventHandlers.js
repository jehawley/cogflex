// eventHandlers.js
// Contains all key event handling functions for the game window
function handleStartScreen(e) {
  if ((e.type === 'keydown') &&
      (e.keyCode === 13) &&
      renderData.allImagesLoaded) {
    if (saveInitialData()) {
      changeScreen(instructionScreen, handleInstructionScreen);
    }
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
    changeScreen(levelScreen, handleLevelScreen);
  }
}

function handleChooseLevelScreenEnd(e) {

}

function handleLevelScreen(e) {
  if (e.type === 'keydown') {
    keysDown[e.keyCode] = true;
    // 80 = P
    if (e.keyCode === 80) {
      paused = !paused;
    }
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
    levelScores.push(GameState.score);
    if (levelQueue.length > 0) {
      chosenLevel = levelQueue.shift();
      GameState.reset();
      shieldActive = false;
      powerupUseState = 0;
      sideImageCurr = 0;
      sideImageCount = 0;
      changeScreen(chooseLevelScreen, handleChooseLevelScreen);
    } else {
      // TODO: Implement something on game finish
      gameOver = true;
      sendDataToServer();
      changeScreen(chooseLevelScreen, handleChooseLevelScreenEnd);
    }
  }
}
