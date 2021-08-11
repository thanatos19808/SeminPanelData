import math
import os

from django.conf import settings
from django.contrib.auth.models import User
from django.core.handlers.wsgi import WSGIRequest
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from semin.models import Paciente, Profile, USER_TYPE_CHOICES
from semin.models import ESTUDIO_CHOICES, ESTUDIO_CHOICES_FOR_VIDEO
from semin.serializers import EstudiosDicomSerializer, ActualizacionEstudioDicomSerializer, ImagenologiaSerializer
from ..models import EstudioDicom, ActualizacionEstudioDicom, Imagenologia
from ..utils.dicom_downloader import DicomDownloader
from ..utils.dicom_converter import DicomConverter
from ..utils.video_converter import VideoConverter
from ..enums.image_extension_enum import ImageExtensionEnum
from ..utils.zip_folder import ZipFolder
from django.http import HttpResponse
import re
from ..enums.accion_enum import AccionEnum
from django.core.mail import send_mail
from ..utils.register_user_request import RegisterUserRequest
import random
import string



@require_http_methods(['GET', 'POST'])
@api_view(['GET', 'POST'])
@csrf_exempt
def estudios(
        request: WSGIRequest,
        **kwargs,
):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        if user_id is '0':            
            estudios_dicom = EstudioDicom.objects.all().order_by('-creacion')
            print(estudios_dicom.count())
        else:
            estudios_dicom = EstudioDicom.objects.filter(
                paciente=user_id
            ).order_by('-creacion')
            
        paginator = Paginator(estudios_dicom, 999)
        page_number = request.GET.get('page')
        x = paginator.get_page(page_number)
        serializer_class = EstudiosDicomSerializer(x, many=True)
        return Response(
                {
                    'data': serializer_class.data
                },
                status=status.HTTP_200_OK
            )
            
    elif request.method == 'POST':
        
        try:
            estudio = EstudioDicom.objects.get(
                id=request.data['estudio_id']
            )
            estudio.liberado = not estudio.liberado
            estudio.save()
            send_mail(
                'Su estudio se encuentra listo',
                f'Su estudio {estudio.tipo_estudio} se encuentra listo para consultarlo entre a www.semindigital.com . Agradecemos su confianza.',
                'info@semin.mx',
                [estudio.paciente.email],
                fail_silently=True,
                )
            return Response(
                {
                    'data': 'Actualizado de manera correcta'
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print(e)
            return Response(
                {
                    'error': 'Algo salio mal por favor intenta de nuevo'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            

@require_http_methods(['GET'])
@api_view(['GET'])   
def descargar(        
              request: WSGIRequest,
              **kwargs,
):

    if request.method == 'GET':
        folder_url = request.GET.get('folder_url')
        response = HttpResponse(
            open(f'{folder_url}', 'rb').read(), 
            content_type='application/x-zip-compressed'
        )
        response['Content-Disposition'] = f'attachment; filename={folder_url}'
        return response

@require_http_methods(['GET'])
@api_view(['GET'])
def actualizaciones(
    request: WSGIRequest,
    **kwargs,
):
    if request.method == 'GET':
        actualizaciones = ActualizacionEstudioDicom.objects.filter(
            estudio_dicom=request.GET.get('estudio_dicom')
        )
        serializer = ActualizacionEstudioDicomSerializer(
            actualizaciones, 
            many=True
        ) 
        
        return Response(
            {
                'data': serializer.data
            },
            status=status.HTTP_200_OK
        )
    



@require_http_methods(['POST'])
@api_view(['POST'])
@csrf_exempt
def calcular_tiempo(
        request: WSGIRequest,
        **kwargs,
):
    if request.method == 'POST':
        try:
            dicom_link = re.search("(?<=dir=)(.*?)(?=&fileid)", request.data['dicom_link'])
            studies = DicomDownloader(
                folder_url=dicom_link.group(),
                patient_name='',
            ).get_list_of_elements_in_folder()
            estimated_total_time = 0
            for index, study in enumerate(studies['d:multistatus']['d:response']):
                if study['d:propstat']['d:prop']['d:getcontenttype'] == "application/dicom":
                    time = math.ceil(
                        int(study['d:propstat']['d:prop']['oc:size']
                        ) / 1048576)
                    estimated_total_time += time
            
            return Response(
                {
                    'tiempo_total_estimado': estimated_total_time
                },
                status=status.HTTP_200_OK
                )
        except Exception as e:
            print(e)
            return Response(
                {
                    'error': 'URL no valida'
                },
                status=status.HTTP_406_NOT_ACCEPTABLE
            )
            


@require_http_methods(['GET', 'POST'])
@api_view(['GET', 'POST'])
@csrf_exempt
def cargar_estudio(
        request: WSGIRequest,
        **kwargs,
):
    # TODO: Add decorators for filters
    if request.method == 'GET':
        return Response(
            {
                'ok': 'ok'
            },
            status=status.HTTP_200_OK
        )
    elif request.method == 'POST':
        # if (request.user.profile.tipo != 'Radiologo'):
        #     content = {
        #         'status': 'UNAUTHORIZED'
        #     }
        #     return Response(content, status=status.HTTP_401_UNAUTHORIZED)

        estudio = request.data['estudio']
        estudio_choice = [item for item in ESTUDIO_CHOICES if estudio in item]
        estudio_can_convert_to_video = [item for item in ESTUDIO_CHOICES_FOR_VIDEO if estudio in item]

        if not estudio_choice:
            return Response(
                {
                    'error': 'Estudio no valido'
                },
                status=status.HTTP_406_NOT_ACCEPTABLE
            )
        paciente_request = request.data['paciente']

        # Checar si el paciente ya esta registrado en la plataforma sino se crea un usuario para el
        try:
            paciente = Paciente.objects.get(email=paciente_request['email'])
        except Exception as e:
            if len(paciente_request) < 4:
                return Response(
                    {
                        'error': 'Paciente no encontrado, faltan datos para completar el registro'
                    },
                    status=status.HTTP_406_NOT_ACCEPTABLE
                )
            paciente_request = request.data['paciente']
            source = string.ascii_letters + string.digits
            created_pswd = ''.join((random.choice(source) for i in range(12)))
            registered_correctly = RegisterUserRequest().register_user_rest_auth(
                email=paciente_request['email'],
                password=created_pswd
                )

            if registered_correctly:

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

                send_mail(
                    'Registro realizado de manera exitosa',
                    f'Su cuenta ha sido creada de manera correcta puede entrar a ella en www.semindigital.com. Su contraseña es: {created_pswd}. Agradecemos su confianza.',
                    'info@semin.mx',
                    [paciente.email],
                    fail_silently=False,
                    )
            else:
                return Response(
                    {
                        'error': 'Algo salio mal registrando al usuario'
                    },
                    status=status.HTTP_406_NOT_ACCEPTABLE
                )


        # Accesar a los recursos de DICOM SEMIN
        patient_name = f'{paciente.nombre}_{paciente.apellido_paterno}_{paciente.apellido_materno}'
        # Extraer la url
        dicom_link = re.search("(?<=dir=)(.*?)(?=&fileid)", request.data['dicom_link'])
        downloader = DicomDownloader(
            folder_url=dicom_link.group(),
            patient_name=patient_name,
        ).download_studies()

        if downloader is False:
            return Response(
                {
                    'error': 'URL no valida'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Convertir las imagenes de dicom a jpg
        converter = DicomConverter(
            image_list=downloader,
            patient_name=patient_name,
            convert_to=ImageExtensionEnum.jpeg
        ).convert_image()

        if converter is False:
            return Response(
                {
                    'error': 'Algo salio mal al convertir el archivo DICOM'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Checar cuantos archivos
        # Checar que el estudio sea resonancia magnetica o tomografia computalizada
        if len(converter) > 5 and estudio_can_convert_to_video:
            video_converter = VideoConverter(
                patient_name=patient_name,
            ).convert_to_video()
            if video_converter is False:
                return Response(
                    {
                        'error': 'Algo salio mal al intentar crear el video'
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        # Zip the files
        compression = ZipFolder(
            patient_name=patient_name,
        ).zip_content()
        if compression is False:
            return Response(
                {
                    'error': 'ALgo salio mal al comprimir el archivo'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Create record in the BD
        estudio_dicom = EstudioDicom.objects.create(
            paciente=paciente,
            directorio_paciente=f'{settings.FOLDER_FOR_STUDIES}/{patient_name}.zip',
            tipo_estudio=estudio,
        )
        # Obtener el doctor de un decorador
        user = Imagenologia.objects.get(
            id=request.user.profile.id_sem
        )
        
        ActualizacionEstudioDicom.objects.create(
             doctor=user,
             estudio_dicom=estudio_dicom,
             accion=AccionEnum.CREACION.value,
        )

        return Response(
            {
                'ok': 'ok'
            },
            status=status.HTTP_200_OK
        )
        


# TODO: REMOVE
@require_http_methods(['GET'])
@api_view(['GET'])
def imagenologo(
    request: WSGIRequest,
    **kwargs,
):
    if request.method == 'GET':
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
 