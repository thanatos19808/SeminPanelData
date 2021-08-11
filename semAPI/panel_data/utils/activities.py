import sys
import os
import requests
from datetime import date
from datetime import datetime
from rest_framework.fields import JSONField
import json
from panel_data.models.finanzas_models import *
from panel_data.models.ventas_models import *
from panel_data.models.activities_models import *


class InsertData:
    # format = now.strftime('Día :%d, Mes: %m, Año: %Y, Hora: %H, Minutos: %M, Segundos: %S')
    def login(self, username:str)-> bool:
        print('entrando a la insersion de datos privada')
        r = requests.post(
            'http://semindigital.com:8005/panel_data/activities/registration_login', 
            data = {
                'nombre': username,
                'date': datetime.now(),
            }
        )
        if r.status_code in (201, 400):
            return True
        else:
            return False
    
    def activities_view(self, username:str, consult:str):
        print('consulta ', consult , ' entrando al registro de lo que ve el usuario')
        r = requests.post(
            'http://semindigital.com:8005/panel_data/activities/registration_views',
            data = {
                'nombre' : username,
                'consulta' : consult,
                'date' : datetime.now(),
            }
        )
        if r.status_code in (201, 400):
            return True
        else:
            return False
