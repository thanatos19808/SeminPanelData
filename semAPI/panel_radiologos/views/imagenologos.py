import random
import string
from panel_radiologos.utils.register_user_request import RegisterUserRequest
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.core.handlers.wsgi import WSGIRequest
from django import forms
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser
import cv2
from ..utils.word_file_manager import WordFileManager
import os
from django.core.files.storage import FileSystemStorage
from semin.models import Paciente, Profile, USER_TYPE_CHOICES
from django.conf import settings
from rest_framework import serializers
from ..utils.zip_folder import ZipFolder
from ..models import EstudioDicom, ActualizacionEstudioDicom, Imagenologia
from django.db import models
from semin.serializers import ImagenologiaSerializer
from django.contrib.auth.models import User


@require_http_methods(['POST', 'GET'])
@api_view(['POST', 'GET'])
@csrf_exempt
def test(
        request: WSGIRequest,
        **kwargs,
):
    if request.method == 'POST':
        # Register user with rest-auth
        paciente_request = request.data['paciente']
        source = string.ascii_letters + string.digits
        created_pswd = ''.join((random.choice(source) for i in range(12)))
                    
        RegisterUserRequest().register_user_rest_auth(
            email=paciente_request['email'],
            password=created_pswd
        )

        user = User.objects.get(
            email=paciente_request['email']
        )

        profile = Profile.objects.get(
            user=user
        )
        paciente = Paciente.objects.create(
                email=paciente_request['email'],
                nombre=paciente_request['nombre'],
                apellido_paterno=paciente_request['apellido_paterno'],
                apellido_materno=paciente_request['apellido_materno'],
            )

        paciente.editors.add(user)
        profile.id_sem = paciente.id
        profile.tipo = 'Paciente'
        profile.save()

        return Response(
            {
                'error': 'No se encontro algun archivo'
            },
            status=status.HTTP_200_OK
        )




@require_http_methods(['PUT', 'GET'])
@api_view(['PUT', 'GET'])
@csrf_exempt
def update(
        request: WSGIRequest,
        **kwargs,
):
    folder_for_water_marks = settings.WATER_MARKS
    
    
    if request.method == 'PUT':
        # if the post request has a file under the input name 'file', then save the file. 
        request_file = request.FILES['file'] if 'file' in request.FILES else None
        if request_file:
            try:
                fs = FileSystemStorage(
                    location=f'{folder_for_water_marks}/'
                    )
                filename = fs.save(request_file.name, request_file)
                imagenologo_id = request.GET.get('user_id')
                Imagenologia.objects.filter(
                    id=imagenologo_id
                ).update(water_mark=filename)
                print('HERE')
                return Response(
                    {
                        'status': 'Updated correctly'
                    },
                        status=status.HTTP_200_OK
                    )  
            except:
                return Response(
                    {
                        'error': 'Algo salio mal por favor intente de nuevo4'
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
       
        return Response(
                {
                    'error': 'No se encontro algun archivo'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    elif request.method == 'GET':
        imagenologo = Imagenologia.objects.get(
            id=request.GET.get('user_id')
        )
        
        serializer = ImagenologiaSerializer(
            imagenologo
        ) 
        
        return Response(
            {
                'data': serializer.data
            },
            status=status.HTTP_200_OK
        )
            