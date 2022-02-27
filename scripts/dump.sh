#!/bin/bash

set -e
. ./colors.sh

CONTAINER_NAME='warstars-database'
DUMP_FILE="dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql"

cd ../

if [ "$( docker container inspect -f '{{.State.Running}}' $CONTAINER_NAME )" == "true" ]; then
  echo "${BLUE}Starting database dump"

  if [ -d 'database-dump' ]; then
    cd database-dump
  else
    mkdir database-dump && cd database-dump
  fi

  docker exec -t $CONTAINER_NAME pg_dumpall -c -U warstars > $DUMP_FILE
  DUMP_SIZE=$(ls -lh $DUMP_FILE | awk '{print  $5}')
  echo "${YELLOW}Dump size - $DUMP_SIZE"
  echo "${GREEN}Database dump completed"

else
  echo "${RED}$CONTAINER_NAME isn't running"
  exit 1
fi
