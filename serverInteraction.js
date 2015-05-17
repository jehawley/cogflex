function saveInitialData() {
  subjectID = $('#participantID').val();
  
  if ($('#skill').prop('checked')) {
    levelSet = 'S';
  } else if ($('#nonskill').prop('checked')) {
    levelSet = 'N';
  } else {
    alert('Error: no level set selected');
    return false;
  }

  for (var i = 1; i < 11; ++i) {
    if($('#level' + i).prop('checked')) {
      levelList.push(i);
      levelQueue.push(i);
    }
  }

  if (levelList.length == 0) {
    alert('Error: No levels selected');
    return false;
  }

  chosenLevel = levelQueue.shift();
  $('#dataContainer').empty();
  return true;
}

function sendDataToServer () {
  // Holds information collected during gameplay in csv format
  var playDataString = "";

  var pair = 0;
  var today = new Date();
  var sessionID = today.getTime();
  var day;
  var month;
  var year;
  if (today.getDate() < 10) {
    day = "0" + today.getDate();
  } else {
    day = "" + today.getDate();
  }
  if (today.getMonth() < 9) {
    month = "0" + (today.getMonth() + 1);
  } else {
    month = "" + (today.getMonth() + 1);
  }
  year = today.getFullYear();

  headerRow = ['ID', 'Date', 'Timestamp', 'Run',
               'Level', 'Contingency', 'Reversed', 'Correct',
               'Win', 'Side Chosen', 'Correct Side', 'Winning Side',
               'Score', 'Trial Number', '% Stars Hit', '% Bombs Hit'];
  playDataString += headerRow.join(',') + "\n";

  var originalP = 0;
  var level;
  var i;
  var score;
  var fractionStars;
  var fractionBombs;
  // allLevels is a copy of levelList
  var allLevels = levelList.slice(0);
  // allScores is a copy of levelScores
  var allScores = levelScores.slice(0);
  var playDataRow = new Array(16);
  for (level = allLevels.shift();
       typeof level != 'undefined';
       level = allLevels.shift()) {
    originalP = successP[level][0];
    score = allScores.shift();
    if (totalCoinsPerLevel[level] === 0)
    {
      fractionStars = 0;
    } else {
      fractionStars = (coinsHitPerLevel[level] /
                       totalCoinsPerLevel[level]).toString().substring(0, 6);
    }
    if (totalEnemiesPerLevel[level] === 0)
    {
      fractionBombs = 0;
    } else {
      fractionBombs = (enemiesHitPerLevel[level] /
                       totalEnemiesPerLevel[level]).toString().substring(0, 6);
    }

    for (i = 0; i < sideChosenRecord[level].length; ++i){
      playDataRow[0] = subjectID;
      playDataRow[1] = "" + year + month + day;
      playDataRow[2] = sessionID;
      if (successP[level][i] === originalP) {
        playDataRow[3] = pair;
      } else {
        playDataRow[3] = pair + 1;
      }
      playDataRow[4] = level;
      playDataRow[5] = successP[level][i]
      if (reversed[level][i]) {
        playDataRow[6] = 1;
      } else {
        playDataRow[6] = 0;
      }
      if (sideChosenRecord[level][i] === correctSideRecord[level][i]) {
        playDataRow[7] = 1;
      } else {
        playDataRow[7] = 0;
      }
      if (sideChosenRecord[level][i] === winLossRecord[level][i]) {
        playDataRow[8] = 1;
      } else {
        playDataRow[8] = 0;
      }
      playDataRow[9] = sideChosenRecord[level][i];
      playDataRow[10] = correctSideRecord[level][i];
      playDataRow[11] = winLossRecord[level][i];
      playDataRow[12] = score;
      playDataRow[13] = i;
      playDataRow[14] = fractionStars;
      playDataRow[15] = fractionBombs;
      playDataString += playDataRow.join(',') + "\n";
    }
    
  }

  var filename = [year, month, day].join("-");
  filename += "_" + sessionID + "_" + subjectID + ".csv"; 

  var playData = { playDataString : playDataString,
                   filename : filename };

  $.post('https://techhouse.org/~johnh/server/postResults.php',
         playData,
         function (data, textStatus, jqXHR) {
           console.log('success');
         });
}
