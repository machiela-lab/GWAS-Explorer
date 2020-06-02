#!/bin/bash

DB_USER=$1
DB_PASS=$2
ARCHIVE_FILE=$3

echo "LOADING MYSQL MODULE..."
module load mysql/8.0

echo "RESTORING MYSQL DATABASE FROM ARCHIVE FILE $ARCHIVE_FILE ..."
local_mysql restore --archivefile=$ARCHIVE_FILE

echo "STARTING MYSQL SERVER..."
local_mysql start

echo "LOGGING INTO MYSQL SHELL..."
mysql -u $DB_USER -p"DB_PASS" --host=$SLURM_NODELIST --port=55555 plcogwas

show tables
\q

echo "EXITED MYSQL SHELL..."

echo "STOPPING MYSQL SERVER..."
local_mysql stop
