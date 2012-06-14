// render.js
// Contains the screen rendering functions and all necessary image data

var renderData = {
  loadImages: function () {

  },
  ship: 0
};

function renderStartScreen() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'rgb(0,0,255)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'white';
  ctx.font = '32pt Helvetica';
  ctx.textAlign = 'left';
  ctx.fillText('[Title]', 200, 100);

  ctx.font = '24pt Helvetica';
  ctx.fillText('Press [Enter] to continue', 75, 250);
};

function renderInstructionScreen() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
 
  ctx.fillStyle = 'rgb(0, 0, 255)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'black';
  ctx.font = '24pt Helvetica';
  ctx.fillText('Press [s] to continue', 100, 250);
};

function renderChooseLevelScreen() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'rgb(0, 0, 255)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
};

function renderLevel1Screen() {

};

function renderResultsScreen() {

};
