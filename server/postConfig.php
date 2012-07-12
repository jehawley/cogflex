<?php
  $fh = fopen('testFile', 'a') or die('failed to open file');
  fwrite($fh, 'ping!\n') or die('failed to write to file');
  fclose($fh) or die('failed to close file');
  echo '[Success Message]';
?>
