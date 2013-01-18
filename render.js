// render.js
// Contains the screen rendering functions and all necessary image data

var renderData = {
  // The total number of images currently loaded
  loadCount: 0,
  // The total number of images in renderData
  totalImages: 50,
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

    this.level1Icon.src = 'images/level1Icon.png';
    this.level1Background.src = 'images/level1Background.png';
    this.level1SideL.src = 'images/level1SideL.png';
    this.level1SideR.src = 'images/level1SideR.png';
    this.level1SideLNarrow.src = 'images/level1SideLNarrow.png';
    this.level1SideRNarrow.src = 'images/level1SideRNarrow.png';
    this.level1SideA0.src = 'images/level1SideA.png';
    this.level1SideA1.src = 'images/level1SideA2.png';
    this.level1SideB0.src = 'images/level1SideB.png';
    this.level1SideB1.src = 'images/level1SideB2.png';

    this.level2Icon.src = 'images/level2Icon.png';
    this.level2Background.src = 'images/level2Background.png';
    this.level2SideL.src = 'images/level2SideL.png';
    this.level2SideR.src = 'images/level2SideR.png';
    this.level2SideLNarrow.src = 'images/level2SideLNarrow.png';
    this.level2SideRNarrow.src = 'images/level2SideRNarrow.png';
    this.level2SideA0.src = 'images/level2SideA.png';
    this.level2SideA1.src = 'images/level2SideA2.png';
    this.level2SideB0.src = 'images/level2SideB.png';
    this.level2SideB1.src = 'images/level2SideB2.png';
    
    this.level3Icon.src = 'images/level3Icon.png';
    this.level3Background.src = 'images/level3Background.png';
    this.level3SideL.src = 'images/level3SideL.png';
    this.level3SideR.src = 'images/level3SideR.png';
    this.level3SideLNarrow.src = 'images/level3SideLNarrow.png';
    this.level3SideRNarrow.src = 'images/level3SideRNarrow.png';
    this.level3SideA0.src = 'images/level3SideA.png';
    this.level3SideA1.src = 'images/level3SideA2.png';
    this.level3SideB0.src = 'images/level3SideB.png';
    this.level3SideB1.src = 'images/level3SideB2.png';

    this.level4Icon.src = 'images/level4Icon.png';
    this.level4Background.src = 'images/level4Background.png';
    this.level4SideL.src = 'images/level4SideL.png';
    this.level4SideR.src = 'images/level4SideR.png';
    this.level4SideLNarrow.src = 'images/level4SideLNarrow.png';
    this.level4SideRNarrow.src = 'images/level4SideRNarrow.png';
    this.level4SideA0.src = 'images/level4SideA.png';
    this.level4SideA1.src = 'images/level4SideA2.png';
    this.level4SideB0.src = 'images/level4SideB.png';
    this.level4SideB1.src = 'images/level4SideB2.png';

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

renderData.level1Icon = new Image();
renderData.level1Background = new Image();
renderData.level1SideL = new Image();
renderData.level1SideR = new Image();
renderData.level1SideLNarrow = new Image();
renderData.level1SideRNarrow = new Image();
renderData.level1SideA0 = new Image();
renderData.level1SideA1 = new Image();
renderData.level1SideB0 = new Image();
renderData.level1SideB1 = new Image();

renderData.level2Icon = new Image();
renderData.level2Background = new Image();
renderData.level2SideL = new Image();
renderData.level2SideR = new Image();
renderData.level2SideLNarrow = new Image();
renderData.level2SideRNarrow = new Image();
renderData.level2SideA0 = new Image();
renderData.level2SideA1 = new Image();
renderData.level2SideB0 = new Image();
renderData.level2SideB1 = new Image();

renderData.level3Icon = new Image();
renderData.level3Background = new Image();
renderData.level3SideL = new Image();
renderData.level3SideR = new Image();
renderData.level3SideLNarrow = new Image();
renderData.level3SideRNarrow = new Image();
renderData.level3SideA0 = new Image();
renderData.level3SideA1 = new Image();
renderData.level3SideB0 = new Image();
renderData.level3SideB1 = new Image();

renderData.level4Icon = new Image();
renderData.level4Background = new Image();
renderData.level4SideL = new Image();
renderData.level4SideR = new Image();
renderData.level4SideLNarrow = new Image();
renderData.level4SideRNarrow = new Image();
renderData.level4SideA0 = new Image();
renderData.level4SideA1 = new Image();
renderData.level4SideB0 = new Image();
renderData.level4SideB1 = new Image();

var initLevelImages = [];
initLevelImages[1] = function () {
  return {
           background: renderData.level1Background,
           sideL: renderData.level1SideL,
           sideR: renderData.level1SideR,
           sideLNarrow: renderData.level1SideLNarrow,
           sideRNarrow: renderData.level1SideRNarrow,
         };
} 

initLevelImages[2] = function () {
  return {
           background: renderData.level2Background,
           sideL: renderData.level2SideL,
           sideR: renderData.level2SideR,
           sideLNarrow: renderData.level2SideLNarrow,
           sideRNarrow: renderData.level2SideRNarrow,
         };
} 

initLevelImages[3] = function () {
  return {
           background: renderData.level3Background,
           sideL: renderData.level3SideL,
           sideR: renderData.level3SideR,
           sideLNarrow: renderData.level3SideLNarrow,
           sideRNarrow: renderData.level3SideRNarrow,
         };
}

initLevelImages[4] = function () {
  return {
           background: renderData.level4Background,
           sideL: renderData.level4SideL,
           sideR: renderData.level4SideR,
           sideLNarrow: renderData.level4SideLNarrow,
           sideRNarrow: renderData.level4SideRNarrow,
         };
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

    backCtx.drawImage(renderData.level1Icon, 100, 100,
                      (WIDTH-200)/3, (WIDTH-200)/3);
    backCtx.drawImage(renderData.level2Icon, 300, 100, 
                      (WIDTH-200)/3, (WIDTH-200)/3);
    backCtx.drawImage(renderData.level3Icon, 100, 300,
                      (WIDTH-200)/3, (WIDTH-200)/3);
    backCtx.drawImage(renderData.level4Icon, 300, 300,
                      (WIDTH-200)/3, (WIDTH-200)/3); 
    dirty = false;

    topCtx.fillStyle = 'white';
    topCtx.font = '20pt Helvetica';
    topCtx.textAlign = 'center';
    for (var i = 1; i <= LEVEL_COUNT; ++i) {
      if (levelScores[i]) {
        topCtx.fillText('Score: ' + levelScores[i],
                        150 + ((i + 1) % 2) * 200,
                        250 + Math.floor(i / 2.1) * 200);
      }
    }
  }

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  if (!gameOver) {
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgb(0, 255, 0)';
    ctx.strokeRect(100 + ((chosenLevel + 1) % 2) * 200,
                   100 + Math.floor(chosenLevel / 2.1) * 200,
                   (WIDTH - 200) / 3,
                   (WIDTH - 200) / 3);
  }
}

function renderLevelScreen() {
  var levelImages = initLevelImages[chosenLevel]();
  if (dirty) {
    backCtx.clearRect(0, 0, WIDTH, HEIGHT);
    backCtx.drawImage(levelImages.background, 0, 0, WIDTH, HEIGHT);
    ctx.translate(WIDTH/2, HEIGHT/2);
    ctx.rotate(Math.PI);
    ctx.translate(-WIDTH/2, -HEIGHT/2);

    dirty = false;
  }

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

  if (forcedLevelQuit) {
    //TODO: Message on forced level quit
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = 'white';
    ctx.font = '24pt Helvetica';
    ctx.textAlign = 'center';
    ctx.fillText('Score:', WIDTH / 2, 75);
    ctx.fillText(GameState.score, WIDTH / 2, 100);
  } else {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = 'white';
    ctx.font = '24pt Helvetica';
    ctx.textAlign = 'center';
    ctx.fillText('Score:', WIDTH / 2, 75);
    ctx.fillText(GameState.score, WIDTH / 2, 100);
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
  topCtx.fillStyle = 'rgba(255, 255, 255, ' +
                     (1 - powerupUseState/14) +
                     ')';
  topCtx.fillRect(0, 0, WIDTH, HEIGHT);
  powerupUseState -= 1;
}

drawPowerupEffect[2] = function () {
  topCtx.fillStyle = 'rgba(0, 0, 255, ' + (powerupUseState/3-0.1) + ')';
  topCtx.beginPath();
  topCtx.arc(WIDTH - player.posX, HEIGHT - OFFSET - SHIP_WIDTH / 4,
             SHIP_WIDTH / 2 + 5, 0, 2 * Math.PI, true);
  topCtx.fill();
}

drawPowerupEffect[3] = function () {
  powerupUseState -= 1;
  topCtx.fillStyle = 'rgba(0, 150, 0, 0.5)';
  topCtx.fillRect(0, 0, WIDTH, HEIGHT);
  if (powerupUseState <= 0) {
    player.speed = SHIP_DESCENT;
  }
}

drawPowerupEffect[4] = function () {
  powerupUseState -= 1;
  topCtx.fillStyle = 'white';
  topCtx.font = (powerupUseState*15+30)+'pt Helvetica';
  topCtx.textAlign = 'center';
  topCtx.fillText('+', 80, 50+powerupUseState*15);
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
