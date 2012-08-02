$(document).ready(function () {
  init();
});

function init() {
  ctx = document.getElementById('mainC').getContext('2d');
  dataCtx = document.getElementById('dataC').getContext('2d');
  backCtx = document.getElementById('backC').getContext('2d');
  topCtx = document.getElementById('topC').getContext('2d');
  renderData.loadImages();
  initTestValues(4, [1.0, 0.0, 0.8, 0.2], [15, 15, 15, 15]);
  buildLevel1();
  changeScreen(startScreen, handleStartScreen);
}

function changeScreen(newUpdate, newEvent) {
  dataCtx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  backCtx.clearRect(0, 0, WIDTH, HEIGHT);
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
