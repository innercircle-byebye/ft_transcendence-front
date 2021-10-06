#!/bin/sh

alias front-dev-up='docker compose -f docker-compose.dev.yml up'
alias front-dev-up-build='docker compose -f docker-compose.dev.yml up --build'
alias front-dev-down='docker compose -f docker-compose.dev.yml down'
