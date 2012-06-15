// eventHandlers.js
// Contains all key event handling functions for the game window
var keysDown = [];
var powerupUsed = false;

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
  }
}

function handleLevelScreen(e) {
  if (e.type === 'keydown') {
    keysDown[e.keyCode] = true;
  }
  if (e.type === 'keyup') {
    keysDown[e.keyCode] = false;
    // TODO: Add "use powerup" button
    /* if(e.keyCode === [[code]]){
         powerupUsed = false;
       }*/
  }
}

function handleResultsScreen(e) {

}
