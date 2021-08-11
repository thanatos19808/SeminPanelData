#!/bin/bash

NAME="semAPI"
DJANGODIR=/home/semin/semin-server/tienda/semAPI
SOCKFILE=/home/semin/semin-server/tienda/semAPI/sock/gunicorn.sock 
LOGFILE=/home/semin/semin-server/tienda/semAPI/logs/gunicorn.log 
USER=root 
GROUP=root 
NUM_WORKERS=3 
DJANGO_SETTINGS_MODULE=api_crud.settings 
DJANGO_WSGI_MODULE=api_crud.wsgi 
cd $DJANGODIR 
source envSEM/bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE 
export PYTHONPATH=$DJANGODIR:$PYTHONPATH 
RUNDIR=$(dirname $SOCKFILE)
test -d $RUNDIR || mkdir -p $RUNDIR 

gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME\
  --workers $NUM_WORKERS \
  --user=$USER --group=$GROUP \
  --bind=unix:$SOCKFILE \
  --log-level=debug \
  --log-file=$LOGFILE \
  --timeout=300
