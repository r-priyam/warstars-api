#!/bin/bash

set -e
. ./colors.sh

cd ../
if [[ $1 == 'dev' ]];
then
  echo "${BLUE}Starting docker for development"
  docker-compose -f docker-compose.dev.yml up

elif [[ $1 == 'prod' ]];
then
  echo "${GREEN}Starting docker for production"
  docker-compose up -d

else
  echo "${RED}Expected 'dev' or 'prod' as an argument"
  exit 1
fi
