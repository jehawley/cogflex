// eventHandlers.js
// Contains all key event handling functions for the game window
function handleStartScreen(e) {
  if ((e.type === 'keydown') && (e.keyCode === 13)) {
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
  if ((e.type === 'keydown') && (e.keyCode === 39)) {
    chosenLevel = Math.min(chosenLevel + 1, 4);
  }

  if ((e.type === 'keydown') && (e.keyCode === 37)) {
    chosenLevel = Math.max(chosenLevel - 1, 1);
  }

  if ((e.type === 'keydown') && (e.keyCode === 13)) {
    buildLevel();
    changeScreen(levelScreen, handleLevelScreen);
  }
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
    changeScreen(chooseLevelScreen, handleChooseLevelScreen);
  }
}
