// render.js
// Contains the screen rendering functions and all necessary image data

var renderData = {
  loadImages: function () {
    this.level1Icon.onload = renderData.imageLoaded;
    this.level1Icon.src = 'images/level1Icon.png';
  },
  imageLoaded: function () {
    renderData.loadCount += 1;
  },
  loadCount: 0,
  // The total number of images in renderData
  totalImages: 1
};
renderData.level1Icon = new Image();

function renderStartScreen() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'rgb(0,0,255)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'white';
  ctx.font = '32pt Helvetica';
  ctx.textAlign = 'center';
  ctx.fillText('[Title]', WIDTH / 2, 100);

  ctx.font = '24pt Helvetica';
  ctx.fillText('Press [Enter] to continue', WIDTH / 2, 250);
}

function renderInstructionScreen() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
 
  ctx.fillStyle = 'rgb(0, 0, 255)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'black';
  ctx.font = '24pt Helvetica';
  ctx.textAlign = 'center';
  ctx.fillText('Press [s] to continue', WIDTH / 2, 250);
}

function renderChooseLevelScreen() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'black';
  ctx.font = '24pt Helvetica';
  ctx.textAlign = 'center';
  ctx.fillText('Select a level, then press [Enter]', WIDTH / 2, 50);
  
  ctx.drawImage(renderData.level1Icon, 50, 100, (WIDTH-200)/3, (WIDTH-200)/3);
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgb(0, 255, 0)';
  ctx.strokeRect(50, 100, (WIDTH - 200) / 3, (WIDTH - 200) / 3);
}

function renderLevel1Screen() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'rgb(135, 206, 235)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  player.draw();
}

function renderResultsScreen() {

}

// Object Drawing Methods

function drawBasicShip() {
  ctx.beginPath();

  ctx.fillStyle = 'rgb(0, 0, 200)';
  ctx.moveTo(this.posX - SHIP_WIDTH / 2, OFFSET);
  ctx.lineTo(this.posX, OFFSET + SHIP_WIDTH / 4);
  ctx.lineTo(this.posX + SHIP_WIDTH / 2, OFFSET);
  ctx.lineTo(this.posX, OFFSET + SHIP_WIDTH);
  ctx.fill();
}

function drawBasicCoin() {
  ctx.fillStyle = 'rgb(255, 196, 20)';
  ctx.beginPath();
  ctx.arc(this.posX, this.posY - player.topHeight + OFFSET,
          this.radius, 0, 2 * Math.PI, false);
  ctx.fill();
}

function drawBasicEnemy() {
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.rect(this.posX - this.sideLength / 2,
           this.posY - this.sideLength / 2 - player.topHeight + OFFSET,
           this.sideLength,
           this.sideLength);
}

function drawBasicBarrier() {
  ctx.fillStyle = 'rgb(0, 20, 100)';
  ctx.rect(WIDTH / 2 - 3, this.topHeight - player.topHeight + OFFSET,
           6, this.length); 
}

function drawBasicPowerup() {
  ctx.fillStyle = 'rgb(0, 255, 0)';
  ctx.beginPath();
  ctx.moveTo(this.posX, this.posY - player.topHeight + OFFSET - WIDTH / 2);
  ctx.lineTo(this.posX - WIDTH / 2, this.posY - player.topHeight + OFFSET);
  ctx.lineTo(this.posX, this.posY - player.topHeight + OFFSET + WIDTH / 2);
  ctx.lineTo(this.posX + WIDTH / 2, this.posY - player.topHeight + OFFSET);
  ctx.fill();
}
