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

}

function handleLevelScreen(e) {

}

function handleResultsScreen(e) {

}
