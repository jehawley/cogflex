var WIDTH = 500;
var HEIGHT = 600;
var FPS = 60;
// TODO: Determine appropriate values for these constants
var OFFSET = 30;
var BAR_WIDTH = 5;

var ctx;
var loopID = -1;
var eventFun;

$(document).ready(function () {
  init();
});

function init() {
  ctx = document.getElementById('mainC').getContext('2d');
  renderData.loadImages();
  changeScreen(startScreen, handleStartScreen);
}

function changeScreen(newUpdate, newEvent) {
  if (loopID > 0) {
    clearInterval(loopID);
    window.removeEventListener('keydown', eventFun, true);
    window.removeEventListener('keyup', eventFun, true);
  }
  loopID = setInterval(newUpdate, 1000/FPS);
  eventFun = newEvent;
  window.addEventListener('keydown', eventFun, true);
  window.addEventListener('keyup', eventFun, true);
}
