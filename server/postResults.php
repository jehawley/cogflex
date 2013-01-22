<?php
  header('Access-Control-Allow-Origin: *');
  $participantData = $_POST['playDataString'];
  $fh = fopen('testData.csv', 'a+') or die('Error opening file');
  fwrite($fh, $participantData);
  fclose($fh);
?>
