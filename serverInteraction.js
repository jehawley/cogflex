function saveInitialData() {
  subjectID = $('#participantID').val();
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

  var sessionID = 0;
  var today = new Date();
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

  var originalP = 0;
  var level;
  var i;
  // allLevels is a copy of levelList
  var allLevels = levelList.slice(0);
  for (level = allLevels.shift();
       typeof level != 'undefined';
       level = allLevels.shift()) {
    originalP = successP[level][0];
    for (i = 0; i < sideChosenRecord[level].length; ++i){
      playDataString += subjectID + ",";
      playDataString += (year+month+day) + ",";
      if (successP[level][i] === originalP) {
        playDataString += sessionID + ",";
      } else {
        playDataString += (sessionID + 1) + ",";
      }
      playDataString += level + ",";
      playDataString += successP[level][i] + ",";
      if (reversed[level][i]) {
        playDataString += 1 + ",";
      } else {
        playDataString += 0 + ",";
      }
      if (sideChosenRecord[level][i] === correctSideRecord[level][i]) {
        playDataString += 1 + ",";
      } else {
        playDataString += 0 + ",";
      }
      if (sideChosenRecord[level][i] === winLossRecord[level][i]) {
        playDataString += 1;
      } else {
        playDataString += 0;
      }
      playDataString += "\n";
    }
    
  }

  var playData = { playDataString : playDataString };

  $.post('http://techhouse.org/~johnh/server/postResults.php',
         playData,
         function (data, textStatus, jqXHR) {
           console.log('success');
         });
}
