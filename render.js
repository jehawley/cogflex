// render.js
// Contains the screen rendering functions and all necessary image data

var renderData = {
  loadImages: function () {
    this.ship.src = 'images/ship1.png';
    this.coin.src = 'images/coin3.png';
    this.enemy.src = 'images/enemy2.png';
    this.powerup.src = 'images/powerup1.png';

    this.star.src = 'images/star.png';

    this.level1Icon.src = 'images/level1Icon.png';
    this.level1Background.src = 'images/level1Background.png';
    this.level1SideL.src = 'images/level1SideL.png';
    this.level1SideR.src = 'images/level1SideR.png';
    this.level1SideLNarrow.src = 'images/level1SideLNarrow.png';
    this.level1SideRNarrow.src = 'images/level1SideRNarrow.png';
    this.level1SideA.src = 'images/level1SideA.png';
    this.level1SideB.src = 'images/level1SideB.png';
  },
  imageLoaded: function () {
    renderData.loadCount += 1;
    alert(renderData.loadCount);
  },
  loadCount: 0,
  // The total number of images in renderData
  totalImages: 13
};
renderData.ship = new Image();
renderData.coin = new Image();
renderData.enemy = new Image();
renderData.powerup = new Image();

renderData.star = new Image();

renderData.level1Icon = new Image();
renderData.level1Background = new Image();
renderData.level1SideL = new Image();
renderData.level1SideR = new Image();
renderData.level1SideLNarrow = new Image();
renderData.level1SideRNarrow = new Image();
renderData.level1SideA = new Image();
renderData.level1SideB = new Image();

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

  ctx.font = '18pt Helvetica';
  ctx.fillText('Use the left and right arrow keys to move', WIDTH / 2, 100);

  ctx.fillText('Press [a] to use a powerup', WIDTH / 2, 140);
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

function initRenderLevel1Screen() {
  backCtx.clearRect(0, 0, WIDTH, HEIGHT);
  backCtx.drawImage(renderData.level1Background, 0, 0, WIDTH, HEIGHT);
  ctx.translate(WIDTH/2, HEIGHT/2);
  ctx.rotate(Math.PI);
  ctx.translate(-WIDTH/2, -HEIGHT/2);
}

function renderLevel1Screen() {
  var fogged = false, fogHeight, fogGrad;
  var ind, lowInd, highInd, i, j, len;

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ind = 0;
  lowInd = 0;
  while (ind < (player.posY - OFFSET)) {
    lowInd = ind;
    ind = levelSides[ind].next;
  }

  highInd = ind;
  while (ind < (player.posY - OFFSET + HEIGHT)) {
    ind = levelSides[ind].next;
    if (ind === undefined) {
      break;
    }
    highInd = ind;
  }

  for (ind = lowInd; ind < highInd; ind = levelSides[ind].next) {
    if (levelSides[levelSides[ind].next].x > SIDE_WIDTH) {
    } else if (levelSides[ind].x > SIDE_WIDTH) {
      ctx.drawImage(renderData.level1SideLNarrow, 0,
                    ind - 60 - player.posY + OFFSET);
    } else {
      ctx.drawImage(renderData.level1SideL,
                    0, 0, 50, levelSides[ind].next - ind,
                    0, ind - player.posY + OFFSET,
                    50, levelSides[ind].next - ind);
    }
  }

  for (ind = lowInd; ind < highInd; ind = levelSides[ind].next) {
    if (levelSides[levelSides[ind].next].x > SIDE_WIDTH) {
    } else if (levelSides[ind].x > SIDE_WIDTH) {
      ctx.drawImage(renderData.level1SideRNarrow,
                    WIDTH/2+SHIP_WIDTH/2+1, ind - 60 - player.posY + OFFSET);
    } else {
      ctx.drawImage(renderData.level1SideR,
                    0, 0, 50, levelSides[ind].next - ind,
                    WIDTH-SIDE_WIDTH, ind - player.posY + OFFSET,
                    50, levelSides[ind].next - ind);
    }
  }
  /* TODO: Save this for later 
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(0, lowInd - (player.posY - OFFSET));
  for (ind = lowInd; ind <= highInd; ind = levelSides[ind].next) {
    ctx.lineTo(levelSides[ind].x, ind - (player.posY - OFFSET));
  }
  ctx.lineTo(0, highInd - (player.posY - OFFSET));
  ctx.closePath();
  ctx.moveTo(WIDTH, lowInd - (player.posY - OFFSET));
  for (ind = lowInd; ind <= highInd; ind = levelSides[ind].next) {
    ctx.lineTo(WIDTH - levelSides[ind].x,
               ind - (player.posY - OFFSET));
  }
  ctx.lineTo(WIDTH, highInd - (player.posY - OFFSET));
  ctx.closePath();
  ctx.fill();
  */

  player.draw();

  for (i = 0;
       i < Math.ceil(player.topHeight - OFFSET + HEIGHT);
       ++i) {
    if (objectQueue[i]) {
      objectQueue[i].forEach(function (element, index, array) {
                               element.draw();
                               if (element.length &&
                                   ((player.posY + SHIP_WIDTH / 2) <
                                    (element.posY + element.length / 2))) {
                                 fogged = true;
                                 fogHeight = element.posY + element.length;
                               }
                          });
      if (fogged && (i >= fogHeight)) {
        break;
      }
    }
  }

  if (fogged) {
    fogGrad = ctx.createLinearGradient(0, fogHeight + 5 -
                                          player.posY + OFFSET,
                                       0, HEIGHT);
    fogGrad.addColorStop(0, 'rgba(0, 0, 128, 0.6)');
    fogGrad.addColorStop(0.15, 'rgba(0, 0, 128, 1)');
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, fogHeight + 5 - player.posY + OFFSET,
                 WIDTH, HEIGHT);
  }

  topCtx.clearRect(0, 0, WIDTH, HEIGHT);
  topCtx.font = '42pt Helvetica';
  topCtx.lineWidth = 1;
  topCtx.textAlign = 'center'; 
  topCtx.fillStyle = 'white';
  topCtx.strokeStyle = 'rgb(0, 255, 50)';
  topCtx.fillText(GameState.score, WIDTH / 2, 50);
  topCtx.strokeText(GameState.score, WIDTH / 2, 50);
  if (scoreFlashState > 0) {
    topCtx.fillStyle = 'rgba(0, 255, 50, ' +
                       (-scoreFlashState * scoreFlashState +
                        14 * scoreFlashState)/60 +
                       ')';
    topCtx.fillText(GameState.score, WIDTH / 2, 50);
    scoreFlashState -= 1;
    topCtx.fillStyle = 'white';
  }

  topCtx.drawImage(renderData.powerup, WIDTH - 140, 5, 40, 40);
  topCtx.font = '30pt Helvetica';
  topCtx.fillText('x' + GameState.powerupCount, WIDTH - 75, 40);
  topCtx.strokeText('x' + GameState.powerupCount, WIDTH - 75, 40);

  topCtx.strokeStyle = 'rgb(0, 255, 50)';
  topCtx.beginPath();
  topCtx.arc(80, 32, 30, 0, 2 * Math.PI, true);
  topCtx.closePath();
  topCtx.stroke();
  topCtx.beginPath();
  topCtx.arc(80, 32, 15, 0, 2 * Math.PI, true);
  topCtx.closePath();
  topCtx.fill();
  topCtx.fillStyle = 'white';
  topCtx.beginPath();
  topCtx.arc(80, 32,
             30,
             -Math.PI / 2,
             2*Math.PI*GameState.multiplierBar/
                       (10*GameState.multiplier) - Math.PI / 2,
             false);
  /*topCtx.lineTo(80 + 15*2*Math.PI*GameState.multiplierBar/
                                 (10*GameState.multiplier),
                30 + 15*2*Math.PI*GameState.multiplierBar/
                                 (10*GameState.multiplier));*/
  topCtx.arc(80, 32,
             15,
             2*Math.PI*GameState.multiplierBar/
                       (10*GameState.multiplier) - Math.PI / 2,
             -Math.PI / 2,
             false);
  topCtx.closePath();
  topCtx.fill();
  topCtx.fillStyle = 'rgb(0, 255, 50)';
  topCtx.beginPath();
  topCtx.arc(80, 32, 15, 0, 2 * Math.PI, true);
  topCtx.closePath();
  topCtx.fill();
  topCtx.fillStyle = 'white';
  topCtx.font = '16pt Helvetica'; 
  topCtx.fillText('x' + GameState.multiplier, 80, 40);

  if (redFlashState > 0) {
    topCtx.fillStyle = 'rgba(255, 0, 0, ' +
                       (-redFlashState*redFlashState+14*redFlashState)/60 +
                       ')';
    topCtx.fillRect(0, 0, WIDTH, HEIGHT);
    redFlashState -= 1;
  }

  starQueue.forEach(function (element, index, array) {
                      if (element.type === 'line') {
                        element.x = element.frame/STAR_FRAMES * WIDTH * 0.5 +
                                    (STAR_FRAMES-element.frame)/STAR_FRAMES *
                                    element.xS + 
                                    25 * Math.sin(element.frame *
                                                  3 * Math.PI / 
                                                  STAR_FRAMES);
                        element.y = element.frame/STAR_FRAMES * 25 +
                                    (STAR_FRAMES-element.frame)/STAR_FRAMES *
                                    element.yS;
                      } else if (element.type === 'Vee') {
                      }
                      element.frame += 1;
                      if (element.frame > STAR_FRAMES) {
                        delete array[index];
                        scoreFlashState=20;
                      }
                      topCtx.drawImage(renderData.star,
                                       element.x,
                                       element.y,
                                       20,
                                       20);
                    } );
}

function renderResultsScreen() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'black';
  ctx.font = '20pt Helvetica';
  ctx.textAlign = 'center';
  ctx.fillText('Score:', WIDTH / 2, 50);
  ctx.fillText(GameState.score, WIDTH / 2, 100);
}

function renderDataScreen() {
  dataCtx.clearRect(0, 0, DATA_WIDTH, DATA_HEIGHT);

  dataCtx.fillStyle = 'black';
  dataCtx.font = '20pt Helvetica';
  dataCtx.textAlign = 'center';
  dataCtx.fillText('Score:', DATA_WIDTH / 2, 20);
  dataCtx.fillText(GameState.score, DATA_WIDTH / 2, 40);

  dataCtx.fillText('Powerups: ', DATA_WIDTH / 2, 160);
  dataCtx.fillText(GameState.powerupCount, DATA_WIDTH / 2, 180);

  dataCtx.fillText('Multiplier:', DATA_WIDTH / 2, 70);
  dataCtx.fillText(GameState.multiplier, DATA_WIDTH / 2, 95);
  dataCtx.fillStyle = 'yellow';
  dataCtx.fillRect(0, 115,
                   200 *
                   GameState.multiplierBar /
                   (10*GameState.multiplier), 20);
}

// Object Drawing Methods

function drawBasicShip() {
  ctx.beginPath();

  ctx.fillStyle = 'rgb(0, 50, 255)';
  ctx.strokeStyle = 'rgb(100, 150, 235)';
  ctx.lineWidth = 1.5;
  ctx.moveTo(this.posX - SHIP_WIDTH / 2, OFFSET);
  ctx.lineTo(this.posX, OFFSET + SHIP_WIDTH / 8);
  ctx.lineTo(this.posX + SHIP_WIDTH / 2, OFFSET);
  ctx.lineTo(this.posX, OFFSET + SHIP_WIDTH / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawShip() {
  ctx.drawImage(renderData.ship,
                this.posX - SHIP_WIDTH, this.posY - player.posY + OFFSET,
                SHIP_WIDTH, SHIP_WIDTH / 2);
}

function drawBasicCoin() {
  ctx.fillStyle = 'rgb(255, 196, 20)';
  ctx.beginPath();
  ctx.arc(this.posX, this.posY - player.posY + OFFSET,
          this.radius, 0, 2 * Math.PI, false);
  ctx.fill();
}

function drawCoin() {
  ctx.drawImage(renderData.coin,
                this.posX - this.radius,
                this.posY - this.radius - player.posY + OFFSET,
                2 * this.radius, 2 * this.radius);
}

function drawBasicEnemy() {
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.fillRect(this.posX - this.sideLength / 2,
               this.posY - this.sideLength / 2 - player.posY + OFFSET,
               this.sideLength,
               this.sideLength);
}

function drawEnemy() {
  ctx.drawImage(renderData.enemy,
                this.posX - this.sideLength / 2,
                this.posY - this.sideLength / 2 - player.posY + OFFSET,
                this.sideLength, this.sideLength);
}

function drawBasicBarrier() {
  ctx.fillStyle = 'rgb(128, 0, 128)';
  ctx.fillRect(WIDTH/2 - BAR_WIDTH/2, this.posY - player.posY + OFFSET,
               BAR_WIDTH, this.length);

}

function drawBarrier() {
  ctx.drawImage(renderData.level1SideL,
                0, 0,
                BAR_WIDTH, this.length,
                WIDTH/2 - BAR_WIDTH/2, this.posY - player.posY + OFFSET,
                BAR_WIDTH, this.length); 
}

function drawBasicPowerup() {
  ctx.fillStyle = 'rgb(0, 255, 0)';
  ctx.beginPath();
  ctx.moveTo(this.posX, this.posY - player.posY + OFFSET - this.width/2);
  ctx.lineTo(this.posX - this.width/2, this.posY - player.posY + OFFSET);
  ctx.lineTo(this.posX, this.posY - player.posY + OFFSET + this.width/2);
  ctx.lineTo(this.posX + this.width/2, this.posY - player.posY + OFFSET);
  ctx.fill();
}

function drawPowerup() {
  ctx.drawImage(renderData.powerup,
                this.posX - this.width / 2,
                this.posY - this.width / 2 - player.posY + OFFSET,
                this.width,
                this.width);
}

function drawBasic1SideA() {
  ctx.drawImage(renderData.level1SideA,
                this.posX - this.radius,
                this.posY - this.radius - player.posY + OFFSET,
                2 * this.radius, 2 * this.radius);
}

function drawBasic1SideB() {
  ctx.drawImage(renderData.level1SideB,
                this.posX - this.radius,
                this.posY - this.radius - player.posY + OFFSET,
                2 * this.radius, 2 * this.radius);
}
