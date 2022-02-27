#!/bin/bash

set -e

CONTAINER_NAME='warstars-database'
DUMP_FILE="dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql"

cd ../

if [ "$( docker container inspect -f '{{.State.Running}}' $CONTAINER_NAME )" == "true" ]; then
  echo "$(tput setaf 4)Starting database dump"

  if [ -d 'database-dump' ]; then
    cd database-dump
  else
    mkdir database-dump && cd database-dump
  fi

  docker exec -t $CONTAINER_NAME pg_dumpall -c -U warstars > $DUMP_FILE
  DUMP_SIZE=$(ls -lh $DUMP_FILE | awk '{print  $5}')
  echo "$(tput setaf 3)Dump size - $DUMP_SIZE"
  echo "$(tput setaf 2)Database dump completed"

else
  echo "$(tput setaf 1) $CONTAINER_NAME isn't running"
  exit 1
fi
