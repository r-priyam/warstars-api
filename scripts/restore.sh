#!/bin/bash

set -e
. ./colors.sh

cd ../

[ ! -d "database-dump" ] && { echo "{RED}Database dump directory not found"; exit 1; }

cd database-dump

echo "${BLUE}${BOLD}Enter dump file name to restore -${RESET}"
read FILE_NAME

if [ -f "$FILE_NAME" ]; then
    echo "${BLUE}Starting database dump restore"
    cat $FILE_NAME | docker exec -i warstars_database psql -U warstars -d warstars
    echo "${GREEN}Restore completed"

else
  echo "${BOLD}${BOLD}Database dump file not found!"
  exit 1
fi
