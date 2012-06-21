$(document).ready(function () {
  init();
});

function init() {
  ctx = document.getElementById('mainC').getContext('2d');
  dataCtx = document.getElementById('dataC').getContext('2d');
  renderData.loadImages();
  buildLevel1();
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
