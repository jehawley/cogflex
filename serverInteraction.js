function sendDataToServer () {
  // Holds information collected during gameplay in csv format
  var playDataString = "";

  var sessionID = Date.now();

  var originalP = 0;
  var level;
  var i;
  for (level = 1; level <= 4; ++level) {
    originalP = successP[level][0];
    for (i = 0; i < LEVEL_LENGTH_MIN[level]; ++i){
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
        playDataString += 1 + ",";
      } else {
        playDataString += 0 + ",";
      }
      playDataString += "\n";
    }
    
  }

  alert(playDataString);
  var playData = { playDataString : playDataString };

  $.post('../server/postResults.php',
         playData,
         function (data, textStatus, jqXHR) {
           alert('success');
         });
}
