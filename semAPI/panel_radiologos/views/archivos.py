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
from semin.models import Paciente
from django.conf import settings
from rest_framework import serializers
from ..utils.zip_folder import ZipFolder
from ..models import EstudioDicom, ActualizacionEstudioDicom, Imagenologia
from django.db import models 
from ..enums.accion_enum import AccionEnum
        
@require_http_methods(['POST', 'PUT'])
@api_view(['POST', 'PUT'])
@csrf_exempt
def interpretacion(
        request: WSGIRequest,
        **kwargs,
):
    
    folder_for_studies = settings.FOLDER_FOR_STUDIES
    if request.method == 'POST':        
        pacienteId = request.GET.get('userId')
        paciente = Paciente.objects.get(id=pacienteId)
        patient_name = f'{paciente.nombre}_{paciente.apellido_paterno}_{paciente.apellido_materno}'
        
        # if the post request has a file under the input name 'file', then save the file. 
        request_file = request.FILES['file'] if 'file' in request.FILES else None
        file_extension = os.path.splitext(str(request_file))[1]
        if request_file:
            
            try:
                word_file_manager = WordFileManager(
                        file_name=f'{folder_for_studies}/{patient_name}/{request_file.name}'
                    )
                
                word_file_manager.remove_pdf(
                    user_folder=f'{folder_for_studies}/{patient_name}/'
                )
                
                fs = FileSystemStorage(
                    location=f'{folder_for_studies}/{patient_name}/'
                    ) 
                fs.save(request_file.name, request_file) 
                
                
                # Check if file is PDF or docx
                if file_extension == '.pdf':
                    word_file_manager = WordFileManager(
                        file_name=f'{folder_for_studies}/{patient_name}/{request_file.name}'
                    )
                    word_file_manager.add_water_mark_to_pdf(
                        imagenologo_id=request.user.profile.id_sem,
                        folder_container=f'{folder_for_studies}/{patient_name}'
                    )
                    word_file_manager.remove_pdf()
                else:                    
                    # Add footer, save pdf file and delete docx
                    word_file_manager = WordFileManager(
                        file_name=f'{folder_for_studies}/{patient_name}/{request_file.name}'
                    )
                    word_file_manager.add_footer(
                        imagenologo_id=request.user.profile.id_sem,
                    )
                    word_file_manager.convert_docx_to_pdf()
                    word_file_manager.remove_docx()
                
                # Zip folder with the interpretation and update the element in DB
                ZipFolder(
                    patient_name=patient_name,
                ).zip_content()
                estudio_dicom = EstudioDicom.objects.get(paciente=pacienteId)
                estudio_dicom.interpretado = True
                estudio_dicom.save()
                
                user = Imagenologia.objects.get(
                    id=request.user.profile.id_sem
                )
                
                ActualizacionEstudioDicom.objects.create(
                    doctor=user,
                    estudio_dicom=estudio_dicom,
                    accion=AccionEnum.CARGA_DE_INTERPRETACION.value,
                )

                    
                return Response(
                    {
                        'status': 'Updated correctly'
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
        return Response(
                {
                    'error': 'No se encontro un archivo valido'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    elif request.method == 'PUT':
        try:
            paciente_id = request.data['user_id']
            paciente = Paciente.objects.get(id=paciente_id)
            patient_name = f'{paciente.nombre}_{paciente.apellido_paterno}_{paciente.apellido_materno}'
            
            for file in os.listdir(f'{folder_for_studies}/{patient_name}'):
                if file.endswith('.pdf'):
                    os.remove(f'{folder_for_studies}/{patient_name}/{file}')
            
            
            ZipFolder(
                patient_name=patient_name,
            ).zip_content()
            estudio_dicom = EstudioDicom.objects.get(paciente=paciente_id)
            estudio_dicom.interpretado = False
            estudio_dicom.save()
            user = Imagenologia.objects.get(
                id=request.user.profile.id_sem
            )
                    
            ActualizacionEstudioDicom.objects.create(
                doctor=user,
                estudio_dicom=estudio_dicom,
                accion=AccionEnum.BORRADO_DE_INTERPRETACION.value
            )
            return Response(
                {
                    'ok': 'ok'
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
              

        
