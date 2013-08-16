// render.js
// Contains the screen rendering functions and all necessary image data

var renderData = {
  // The total number of images currently loaded
  loadCount: 0,
  // The total number of images in renderData
  totalImages: 100,
  allImagesLoaded: false,
  loadImages: function () {
    this.titleBack.src = 'images/titleBackground.png';

    this.ship.src = 'images/ship.png';
    this.coin.src = 'images/coin.png';
    this.enemy.src = 'images/enemy.png';
    this.powerup.src = 'images/powerup.png';
    this.star.src = 'images/star.png';

    this.instrBack.src = 'images/instructionBackground.png';
    this.instrNarrow.src = 'images/instructionNarrow.png';

    this.chooseLevelBack.src = 'images/chooseLevelBackground.png';

    this.resultsBack.src = 'images/resultsBackground.png';

    for (var l = 1; l < 10; ++l) {
     this['level'+l+'Background'].src = 'images/level0'+l+'Background.png';
     this['level'+l+'SideL'].src = 'images/level0'+l+'SideL.png';
     this['level'+l+'SideR'].src = 'images/level0'+l+'SideR.png';
     this['level'+l+'SideLNarrow'].src = 'images/level0'+l+'SideLNarrow.png';
     this['level'+l+'SideRNarrow'].src = 'images/level0'+l+'SideRNarrow.png';
     this['level'+l+'SideA0'].src = 'images/level0'+l+'SideA.png';
     this['level'+l+'SideA1'].src = 'images/level0'+l+'SideA2.png';
     this['level'+l+'SideB0'].src = 'images/level0'+l+'SideB.png';
     this['level'+l+'SideB1'].src = 'images/level0'+l+'SideB2.png';
    }

    this.level10Background.src = 'images/level10Background.png';
    this.level10SideL.src = 'images/level10SideL.png';
    this.level10SideR.src = 'images/level10SideR.png';
    this.level10SideLNarrow.src = 'images/level10SideLNarrow.png';
    this.level10SideRNarrow.src = 'images/level10SideRNarrow.png';
    this.level10SideA0.src = 'images/level10SideA.png';
    this.level10SideA1.src = 'images/level10SideA2.png';
    this.level10SideB0.src = 'images/level10SideB.png';
    this.level10SideB1.src = 'images/level10SideB2.png';

    for (img in this) {
      if (this.hasOwnProperty(img) && this[img].src) {
        this[img].onload = this.imageLoaded;
      }
    }
  },
  imageLoaded: function () {
    renderData.loadCount += 1;
    if (renderData.loadCount >= renderData.totalImages) {
      renderData.allImagesLoaded = true;
    }
  }
};
renderData.titleBack = new Image();

renderData.ship = new Image();
renderData.coin = new Image();
renderData.enemy = new Image();
renderData.powerup = new Image();
renderData.star = new Image();

renderData.instrBack = new Image();
renderData.instrNarrow = new Image();

renderData.chooseLevelBack = new Image();

renderData.resultsBack = new Image();

for (var l = 1; l < 11; ++l) {
  renderData['level' + l +'Background'] = new Image();
  renderData['level' + l +'SideL'] = new Image();
  renderData['level' + l +'SideR'] = new Image();
  renderData['level' + l +'SideLNarrow'] = new Image();
  renderData['level' + l +'SideRNarrow'] = new Image();
  renderData['level' + l +'SideA0'] = new Image();
  renderData['level' + l +'SideA1'] = new Image();
  renderData['level' + l +'SideB0'] = new Image();
  renderData['level' + l +'SideB1'] = new Image();
}

var initLevelImages = [];
for (var l = 1; l < 11; ++l) {
  initLevelImages[l] = (function(val) {
      return function () {
          return {
            background: renderData['level' + val + 'Background'],
            sideL: renderData['level' + val + 'SideL'],
            sideR: renderData['level' + val + 'SideR'],
            sideLNarrow: renderData['level' + val + 'SideLNarrow'],
            sideRNarrow: renderData['level' + val + 'SideRNarrow'],
          };
      };
  })(l);
}
 
function renderStartScreen() {
  backCtx.drawImage(renderData.titleBack, 0, 0);

  ctx.fillStyle = 'white';
  ctx.font = '50pt Helvetica';
  ctx.textAlign = 'center';
  ctx.fillText('COGFLEX', WIDTH / 2, 150);
  
  topCtx.clearRect(0, 0, WIDTH, HEIGHT);
  topCtx.fillStyle = 'white';
  topCtx.font = '24pt Helvetica';
  topCtx.textAlign = 'center';
  if (renderData.allImagesLoaded) {
    topCtx.fillText('Press [Enter] to continue', WIDTH / 2, 250);
  } else {
    topCtx.fillText('Loading...', WIDTH / 2, 250);
  }
}

function renderInstructionScreen() {
  if (dirty) {
    backCtx.drawImage(renderData.instrBack, 0, 0);

    ctx.font = '40pt Helvetica';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'rgb(243, 229, 171)';
    ctx.textAlign = 'center';
    
    ctx.fillText('Instructions', WIDTH / 2, 70);
    ctx.strokeText('Instructions', WIDTH / 2, 70);

    ctx.font = '16pt Helvetica';
    ctx.textAlign = 'left';
    
    ctx.fillText('Move ', 125, 120);
    ctx.drawImage(renderData.ship, 185, 100, SHIP_WIDTH, SHIP_WIDTH / 2);
    ctx.lineWidth = 1;
    ctx.fillStyle = 'white';
    ctx.fillText('with the left and right arrow keys', 100, 150);

    ctx.fillText('Collect ', 115, 200);
    ctx.drawImage(renderData.coin, 195, 175, 30, 30);
    ctx.fillText(' to earn points', 227, 200);

    ctx.fillText('Avoid ', 130, 245);
    ctx.drawImage(renderData.enemy, 195, 222, 30, 30);
    ctx.fillText(' or lose points', 227, 245);
    
    ctx.fillText('Pick up ', 116, 290);
    ctx.drawImage(renderData.powerup, 195, 270, 30, 30);
    ctx.fillText(' for special effects', 227, 290);
    ctx.fillText('Press [Space] to use them', 120, 320);

    ctx.fillText('Increase the score multiplier', 90, 385);
    ctx.fillText('to earn even more points', 110, 410);

    ctx.strokeStyle = 'rgb(0, 255, 50)';
    ctx.beginPath();
    ctx.arc(401, 400, 30, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(401, 400, 15, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(401, 400, 30, -Math.PI/2, 2*Math.PI*7/10 - Math.PI/2, false);
    ctx.arc(401, 400, 15, 2*Math.PI*7/10 - Math.PI/2, -Math.PI/2, false);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(0, 255, 50)';
    ctx.beginPath();
    ctx.arc(401, 400, 15, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '16pt Helvetica'; 
    ctx.fillText('x2', 391, 407);

    dirty = false;
  }

  topCtx.fillStyle = 'rgb(0, 191, 255)';
  topCtx.strokeStyle = 'rgb(178, 255, 255)';
  topCtx.lineWidth = 2;
  topCtx.clearRect(0, 0, WIDTH, HEIGHT);
  topCtx.beginPath();
  topCtx.moveTo(330 + 15*Math.sin(animArrow * Math.PI / 50), 450);
  topCtx.lineTo(430 + 15*Math.sin(animArrow * Math.PI / 50), 450);
  topCtx.lineTo(430 + 15*Math.sin(animArrow * Math.PI / 50), 430);
  topCtx.lineTo(470 + 15*Math.sin(animArrow * Math.PI / 50), 475);
  topCtx.lineTo(430 + 15*Math.sin(animArrow * Math.PI / 50), 520);
  topCtx.lineTo(430 + 15*Math.sin(animArrow * Math.PI / 50), 500);
  topCtx.lineTo(330 + 15*Math.sin(animArrow * Math.PI / 50), 500);
  topCtx.stroke();
  topCtx.fill();
  topCtx.fillStyle = 'white';
  topCtx.font = '16pt Helvetica';
  topCtx.textAlign = 'left';
  topCtx.fillText('Press [Right]',
                  335 + 15*Math.sin(animArrow * Math.PI / 50),
                  480);
  topCtx.lineWidth = 1;

  animArrow -= 1;
  if (animArrow < 0) {
    animArrow = 50;
  }
}

function renderInstructionScreen2() {
  if (dirty) {
    backCtx.drawImage(renderData.instrBack, 0, 0);

    ctx.font = '40pt Helvetica';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'rgb(243, 229, 171)';
    ctx.textAlign = 'center';
    
    ctx.fillText('Instructions', WIDTH / 2, 70);
    ctx.strokeText('Instructions', WIDTH / 2, 70);

    ctx.font = '16pt Helvetica';
  
    ctx.fillText('Each level has Decision Collisions', WIDTH / 2, 110);
    ctx.drawImage(renderData.instrNarrow, 190, 135, 120, 60);
    
    ctx.fillText('Find out which object is MOSTLY worth points', 250, 250);
    ctx.fillText('and stick with it', 250, 270);

    var redGrad = ctx.createRadialGradient(200, 300, 3, 190, 310, 30);
    var blueGrad = ctx.createRadialGradient(320, 300, 3, 310, 310, 30);

    redGrad.addColorStop(0, 'rgb(255, 170, 120)');
    redGrad.addColorStop(0.9, 'rgb(255, 0, 0)');
    redGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');
    blueGrad.addColorStop(0, 'rgb(0, 141, 255)');
    blueGrad.addColorStop(0.9, 'rgb(38, 3, 114)');
    blueGrad.addColorStop(1, 'rgba(38, 3, 114, 0)');

    ctx.fillStyle = redGrad;
    ctx.fillRect(160, 280, 60, 60);
    ctx.fillStyle = blueGrad;
    ctx.fillRect(280, 280, 60, 60);

    ctx.fillStyle = 'white';
    ctx.fillText('If the object that mostly WON you points', 250, 375);
    ctx.fillText('starts to mostly LOSE you points, switch.', 250, 400);

    dirty = false;
  }

  topCtx.clearRect(0, 0, WIDTH, HEIGHT);


  topCtx.fillStyle = 'rgb(0, 191, 255)';
  topCtx.strokeStyle = 'rgb(178, 255, 255)';
  topCtx.lineWidth = 2;
  topCtx.clearRect(0, 0, WIDTH, HEIGHT);
  topCtx.beginPath();
  topCtx.moveTo(330 + 15*Math.sin(animArrow * Math.PI / 50), 450);
  topCtx.lineTo(430 + 15*Math.sin(animArrow * Math.PI / 50), 450);
  topCtx.lineTo(430 + 15*Math.sin(animArrow * Math.PI / 50), 430);
  topCtx.lineTo(470 + 15*Math.sin(animArrow * Math.PI / 50), 475);
  topCtx.lineTo(430 + 15*Math.sin(animArrow * Math.PI / 50), 520);
  topCtx.lineTo(430 + 15*Math.sin(animArrow * Math.PI / 50), 500);
  topCtx.lineTo(330 + 15*Math.sin(animArrow * Math.PI / 50), 500);
  topCtx.moveTo(170 - 15 * Math.sin(animArrow * Math.PI / 50), 450);
  topCtx.lineTo(70 - 15 * Math.sin(animArrow * Math.PI / 50), 450);
  topCtx.lineTo(70 - 15 * Math.sin(animArrow * Math.PI / 50), 430);
  topCtx.lineTo(30 - 15 * Math.sin(animArrow * Math.PI / 50), 475);
  topCtx.lineTo(70 - 15 * Math.sin(animArrow * Math.PI / 50), 520);
  topCtx.lineTo(70 - 15 * Math.sin(animArrow * Math.PI / 50), 500);
  topCtx.lineTo(170 - 15 * Math.sin(animArrow * Math.PI / 50), 500); 
  topCtx.stroke();
  topCtx.fill();
  topCtx.fillStyle = 'white';
  topCtx.font = '16pt Helvetica';
  topCtx.textAlign = 'left';
  topCtx.fillText('Press [Enter]',
                  335 + 15*Math.sin(animArrow * Math.PI / 50),
                  480);
  topCtx.fillText('Press [Left]',
                  52 - 15 * Math.sin(animArrow * Math.PI / 50),
                  480);
  topCtx.lineWidth = 1;

  animArrow -= 1;
  if (animArrow < 0) {
    animArrow = 50;
  }
}

function renderChooseLevelScreen() {
  if (dirty) {
    backCtx.drawImage(renderData.chooseLevelBack, 0, 0);

    backCtx.fillStyle = 'white';
    backCtx.font = '22pt Helvetica';
    backCtx.textAlign = 'center';
    if (gameOver) {
      backCtx.fillText('Game Complete!', WIDTH / 2, 75);
    } else {
      backCtx.fillText('Press [Enter] to begin', WIDTH / 2, 75);
    }
    for (var i = 0; i < levelList.length; ++i) {
      backCtx.drawImage(renderData['level' + levelList[i] + 'Background'],
                        300, 300,
                        100, 100, 
                        100 * (i % 3) + 100, 100 * Math.floor(i / 3) + 100,
                        75, 75);
    }

    dirty = false;

    topCtx.fillStyle = 'white';
    topCtx.font = '14pt Helvetica';
    topCtx.textAlign = 'center';
    for (var i = 0; i < levelList.length; ++i) {
      if (levelScores[i]) {
        topCtx.fillText('' + levelScores[i],
                        100 * (i % 3) + 137,
                        100 * Math.floor(i / 3) + 194);
      }
    }
  }

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  if (!gameOver) {
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgb(0, 255, 0)';
    ctx.strokeRect(100 * ((levelList.length - levelQueue.length - 1) % 3) + 100,
                   100 * Math.floor((levelList.length -
                                     levelQueue.length - 
                                     1) / 3) + 100,
                   75,
                   75);
  }
}

function renderLevelScreen() {
  if (dirty) {
    levelImages = initLevelImages[chosenLevel]();

    backCtx.clearRect(0, 0, WIDTH, HEIGHT);
    backCtx.drawImage(levelImages.background, 0, 0, WIDTH, HEIGHT);
    ctx.translate(WIDTH/2, HEIGHT/2);
    ctx.rotate(Math.PI);
    ctx.translate(-WIDTH/2, -HEIGHT/2);

    dirty = false;
  }

  fogged = false;
  var fogGrad;
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
      ctx.drawImage(levelImages.sideLNarrow, 0,
                    ind - 60 - player.posY + OFFSET);
    } else {
      ctx.drawImage(levelImages.sideL,
                    0, 0, 50, levelSides[ind].next - ind,
                    0, ind - player.posY + OFFSET,
                    50, levelSides[ind].next - ind);
    }
  }

  for (ind = lowInd; ind < highInd; ind = levelSides[ind].next) {
    if (levelSides[levelSides[ind].next].x > SIDE_WIDTH) {
    } else if (levelSides[ind].x > SIDE_WIDTH) {
      ctx.drawImage(levelImages.sideRNarrow,
                    WIDTH/2+SHIP_WIDTH/2+1, ind - 60 - player.posY + OFFSET);
    } else {
      ctx.drawImage(levelImages.sideR,
                    0, 0, 50, levelSides[ind].next - ind,
                    WIDTH-SIDE_WIDTH, ind - player.posY + OFFSET,
                    50, levelSides[ind].next - ind);
    }
  }

  player.draw();

  for (i = 0;
       objectIndices[i] < Math.ceil(player.topHeight - OFFSET + HEIGHT);
       ++i) {
    objectQueue[objectIndices[i]].forEach(drawGameElement);
    if (fogged && (objectIndices[i] >= fogHeight)) {
      break;
    }
  }
  
  while (objectIndices.length > 0 &&
         objectIndices[0] < (player.topHeight - OFFSET - 160)) {
      objectIndices.shift();
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

  if (xFlashState > 0) {
    topCtx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    topCtx.font = ((30 - xFlashState) * 10 + 250) + 'pt Helvetica';
    topCtx.fillText('X', WIDTH/2, HEIGHT - 25);
    xFlashState -= 1;

    topCtx.fillStyle = 'rgba(255, 0, 0, ' +
                       (0.4 * Math.sin(xFlashState * Math.PI / 10) + 0.55) +
                       ')';
    topCtx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  if (powerupGetState > 0) {
    topCtx.drawImage(renderData.powerup, WIDTH - 140, 5,
                     40 + 2 * powerupGetState, 40 + 2 * powerupGetState);
    powerupGetState -= 1;
  }

  if (powerupUseState > 0) {
    drawPowerupEffect[chosenLevel]();
  }

  if (warningFlashState > 0) {
    warningFlashState -= 1;
    topCtx.fillStyle = 'rgb(' +
                       Math.round(100*Math.cos(warningFlashState *
                                               Math.PI/25)+
                                  150) + 
                       ', 0, 0)';
    topCtx.font = '42pt Helvetica';
    topCtx.textAlign = 'center';
    topCtx.fillText('Go Left or Right', WIDTH / 2, 120);
  }

  starQueue.forEach(function (element, index, array) {
                      element.x = element.frame / element.s * WIDTH * 0.5 +
                                  (element.s - element.frame) / element.s *
                                  element.xS + 
                                  element.a * Math.sin(element.frame *
                                                       element.p *
                                                       Math.PI / 
                                                       element.s);
                      element.y = element.frame / element.s * 25 +
                                  (element.s-element.frame) / element.s *
                                  element.yS;
                      element.frame += 1;
                      if (element.frame > element.s) {
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

function drawGameElement(element, index, array) {
  element.draw();
  if (element.length &&
      ((player.posY + SHIP_WIDTH / 2) <
       (element.posY + element.length / 2))) {
    fogged = true;
    fogHeight = element.posY + element.length;
  }
}

function renderPauseScreen() {
  topCtx.fillStyle = 'green';
  topCtx.fillRect(100, 100, 300, 300);
  topCtx.fillStyle = 'black';
  topCtx.textAlign = 'center';
  topCtx.font = '24pt Helvetica';
  topCtx.fillText('Press [P] to resume', 250, 250);
}

function renderResultsScreen() {
  if (dirty) {
    backCtx.drawImage(renderData.resultsBack, 0, 0);
    dirty = false;
  }

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'white';
  ctx.font = '24pt Helvetica';
  ctx.textAlign = 'center';
  ctx.fillText('Score:', WIDTH / 2, 75);
  ctx.fillText(GameState.score, WIDTH / 2, 100);

  topCtx.fillStyle = 'rgb(0, 191, 255)';
  topCtx.strokeStyle = 'rgb(178, 255, 255)';
  topCtx.lineWidth = 2;
  topCtx.clearRect(0, 0, WIDTH, HEIGHT);
  topCtx.beginPath();
  topCtx.moveTo(330 + 15*Math.sin(animArrow * Math.PI / 50), 450);
  topCtx.lineTo(430 + 15*Math.sin(animArrow * Math.PI / 50), 450);
  topCtx.lineTo(430 + 15*Math.sin(animArrow * Math.PI / 50), 430);
  topCtx.lineTo(470 + 15*Math.sin(animArrow * Math.PI / 50), 475);
  topCtx.lineTo(430 + 15*Math.sin(animArrow * Math.PI / 50), 520);
  topCtx.lineTo(430 + 15*Math.sin(animArrow * Math.PI / 50), 500);
  topCtx.lineTo(330 + 15*Math.sin(animArrow * Math.PI / 50), 500);
  topCtx.stroke();
  topCtx.fill();
  topCtx.fillStyle = 'white';
  topCtx.font = '16pt Helvetica';
  topCtx.textAlign = 'left';
  topCtx.fillText('Press [Enter]',
                  335 + 15*Math.sin(animArrow * Math.PI / 50),
                  480);
  topCtx.lineWidth = 1;

  animArrow -= 1;
  if (animArrow < 0) {
    animArrow = 50;
  }
}

// Level-dependent Powerup Rendering Methods

var drawPowerupEffect = [];
drawPowerupEffect[1] = function () {
}

drawPowerupEffect[2] = function() {
}

drawPowerupEffect[3] = function() {
}

drawPowerupEffect[4] = function() {
}

drawPowerupEffect[5] = function () {
  topCtx.fillStyle = 'rgba(255, 255, 255, ' +
                     (1 - powerupUseState/14) +
                     ')';
  topCtx.fillRect(0, 0, WIDTH, HEIGHT);
  powerupUseState -= 1;
}

drawPowerupEffect[6] = function () {
  topCtx.fillStyle = 'rgba(0, 0, 255, ' + (powerupUseState/3-0.1) + ')';
  topCtx.beginPath();
  topCtx.arc(WIDTH - player.posX, HEIGHT - OFFSET - SHIP_WIDTH / 4,
             SHIP_WIDTH / 2 + 5, 0, 2 * Math.PI, true);
  topCtx.fill();
}

drawPowerupEffect[7] = function () {
  powerupUseState -= 1;
  topCtx.fillStyle = 'rgba(0, 150, 0, 0.5)';
  topCtx.fillRect(0, 0, WIDTH, HEIGHT);
  if (powerupUseState <= 0) {
    player.speed = SHIP_DESCENT;
  }
}

drawPowerupEffect[8] = function () {
  powerupUseState -= 1;
  topCtx.fillStyle = 'white';
  topCtx.font = (powerupUseState*15+30)+'pt Helvetica';
  topCtx.textAlign = 'center';
  topCtx.fillText('+', 80, 50+powerupUseState*15);
}

drawPowerupEffect[9] = function () {
  topCtx.fillStyle = 'rgba(255, 255, 255, ' +
                     (1 - powerupUseState/14) +
                     ')';
  topCtx.fillRect(0, 0, WIDTH, HEIGHT);
  powerupUseState -= 1;
}

drawPowerupEffect[10] = function () {
  topCtx.fillStyle = 'rgba(0, 0, 255, ' + (powerupUseState/3-0.1) + ')';
  topCtx.beginPath();
  topCtx.arc(WIDTH - player.posX, HEIGHT - OFFSET - SHIP_WIDTH / 4,
             SHIP_WIDTH / 2 + 5, 0, 2 * Math.PI, true);
  topCtx.fill();
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
                this.posX - SHIP_WIDTH / 2, this.posY - player.posY + OFFSET,
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
                this.posY - this.radius - player.posY + OFFSET);
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
                this.posY - this.sideLength / 2 - player.posY + OFFSET)
}

function drawBasicBarrier() {
  ctx.fillStyle = 'rgb(128, 0, 128)';
  ctx.fillRect(WIDTH/2 - BAR_WIDTH/2, this.posY - player.posY + OFFSET,
               BAR_WIDTH, this.length);

}

function drawBarrier() {
  ctx.drawImage(renderData['level'+chosenLevel+'SideL'],
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

function drawSideA() {
  ctx.drawImage(renderData['level' + chosenLevel + 'SideA' + sideImageCurr],
                this.posX - this.radius,
                this.posY - this.radius - player.posY + OFFSET,
                2 * this.radius, 2 * this.radius);
}

function drawSideB() {
  ctx.drawImage(renderData['level' + chosenLevel + 'SideB' + sideImageCurr],
                this.posX - this.radius,
                this.posY - this.radius - player.posY + OFFSET,
                2 * this.radius, 2 * this.radius);
}
