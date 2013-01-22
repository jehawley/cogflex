function saveInitialData() {
  subjectID = $('#participantID').val();
  $('#dataContainer').empty();
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
  for (level = 1; level <= 4; ++level) {
    originalP = successP[level][0];
	    for (i = 0; i < sideChosenRecord[level].length; ++i){
      playDataString += subjectID + ",";
      playDataString += (month+day+year) + ",";
      if (successP[level][i] === originalP) {
        playDataString += sessionID + ",";
      } else {
        playDataString += (sessionID + 1) + ",";
      }
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
