#!/bin/bash

set -e

if [[ $1 == 'dev' ]];
then
  echo "$(tput setaf 4)Starting docker for development"
  docker-compose -f docker-compose.dev.yml up

elif [[ $1 == 'prod' ]];
then
  echo "$(tput setaf 2)Starting docker for production"
  docker-compose up -d

else
  echo "$(tput setaf 1)Expected 'dev' or 'prod' as an argument"
  exit 1
fi
