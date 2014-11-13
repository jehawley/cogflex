<?php
  header('Access-Control-Allow-Origin: http://jehawley.github.com/cogflex');
  $participantData = $_POST['playDataString'];
  $filename = $_POST['filename'];
  $fh = fopen($filename, 'a+') or die('Error opening file');
  fwrite($fh, $participantData);
  fclose($fh);
?>
