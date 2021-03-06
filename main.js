$(document).ready(function () {
  init();
});

function init() {
  ctx = document.getElementById('mainC').getContext('2d');
  backCtx = document.getElementById('backC').getContext('2d');
  topCtx = document.getElementById('topC').getContext('2d');
  renderData.loadImages();
  changeScreen(startScreen, handleStartScreen);
}

function changeScreen(newUpdate, newEvent) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  backCtx.setTransform(1, 0, 0, 1, 0, 0);
  topCtx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  backCtx.clearRect(0, 0, WIDTH, HEIGHT);
  topCtx.clearRect(0, 0, WIDTH, HEIGHT);
  dirty = true;
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
