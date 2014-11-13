#!/bin/bash
MONTHLY_GLOB=$(date --date="yesterday" +%Y-%m)*.csv
for dataFile in $MONTHLY_GLOB
  do mv $dataFile archivedTestData/
done
