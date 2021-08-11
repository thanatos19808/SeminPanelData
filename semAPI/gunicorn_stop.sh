#!/bin/bash
kill -9 `ps aux |grep gunicorn |grep semAPI | awk '{ print $2 }'`
