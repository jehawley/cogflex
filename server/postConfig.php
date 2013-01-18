<?php
  $participantID = (int)$_POST['ID'];
  $fh = fopen((string)$participantID, 'a+') or die('Error opening file');
  $trialCount = (int)$_POST['trialCount'];
  $dataLine = $_POST['sessionNumber'] . ';';
  $reversed = ''; 
  for ($i = 1; $i <= $trialCount; ++$i) {
    $reversed = $_POST['section' . (string)$i . 'R'];
    if (is_null($reversed)) {
      $dataLine .= $_POST['section' . (string)$i . 'Trials'] . ',' .
                   $_POST['section' . (string)$i . 'Count'] . ',' .
                   '0;';
    } else {
      $dataLine .= $_POST['section' . (string)$i . 'Trials'] . ',' .
                   $_POST['section' . (string)$i . 'Count'] . ',' .
                   '1;';
    }
  }
  fwrite($fh, $dataLine) or die('Error writing to file');
  fclose($fh);
  echo 'Configuration for participant #' . (string)$participantID .
       ' has been recorded <br>';
  echo '<a href="config.html">' .
       'Return to configuration page' .
       '</a><br>';
?>
