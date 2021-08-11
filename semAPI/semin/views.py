from django.core.files.storage import FileSystemStorage
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView
from .models import *
from .permissions import IsOwnerOrReadOnly, IsAuthenticated
from .serializers import *
from .pagination import CustomPagination
from django.db.models import Q
import re
import json
import time
from datetime import datetime, date, time, timedelta
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from rest_framework.parsers import FileUploadParser
from django.core.mail import send_mail
import openpay
from openpay import error, http_client, version, util
import urllib3
import requests
from django.db.models import Count
from django.utils.crypto import get_random_string
from django.conf import settings
import stripe 
from zoomus import ZoomClient
from django.template import loader
from django.template.loader import render_to_string, get_template
from rest_framework.views import APIView
from rest_framework.decorators import api_view




class get_delete_update_paciente(RetrieveUpdateDestroyAPIView):
    serializer_class = PacienteSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            paciente = Paciente.objects.get(pk=pk)
        except Paciente.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return paciente

    # Get a paciente
    def get(self, request, pk, *args, **kwargs):
        try:
            paciente = Paciente.objects.get(pk=pk)
        except Paciente.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        paciente = self.get_queryset(pk)
        if(request.user in paciente.editors.all()): # If editors is who makes request
            serializer = PacienteSerializer(paciente)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                    'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a paciente
    def put(self, request, pk, *args, **kwargs):
        try:
            paciente = Paciente.objects.get(pk=pk)
        except Paciente.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        paciente = self.get_queryset(pk)
        if(len(paciente.editors.all())==0):
            paciente.editors.add(request.user)
        if(request.user in paciente.editors.all()): # If editors is who makes request
            serializer = PacienteSerializer(paciente, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a paciente
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_pacientes(ListCreateAPIView):
    serializer_class = PacienteSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       pacientes = Paciente.objects.all()
       return pacientes

    # Get all pacientes
    def get(self, request, *args, **kwargs):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new Paciente
    def post(self, request):
        serializer = PacienteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class get_delete_update_pacienteOp(RetrieveUpdateDestroyAPIView):
    serializer_class = PacienteSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            paciente = Paciente.objects.get(pk=pk)
        except Paciente.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return paciente

    # Get a paciente Op
    def get(self, request, pk, *args, **kwargs):
        try:
            paciente = Paciente.objects.get(pk=pk)
        except Paciente.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        paciente = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"):  # If editors is who makes request
            serializer = PacienteSerializer(paciente)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                    'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a paciente Op
    def put(self, request, pk, *args, **kwargs):
        try:
            paciente = Paciente.objects.get(pk=pk)
        except Paciente.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        paciente = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"):  # If editors is who makes request
            serializer = PacienteSerializer(paciente, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a paciente Op
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_pacientesOp(ListCreateAPIView):
    serializer_class = PacienteSearchSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       pacientes = Paciente.objects.all()
       return pacientes

    # Get all pacientes Op
    def get(self, request, *args, **kwargs):
        queryBuscador = False
        queryBuscador = self.request.GET.get("queryBuscador")
        if (request.user.profile.tipo =="Operador"):  # If editors is who makes request
            if(queryBuscador):
                pacientes = Paciente.objects.all()
                pacientes = pacientes.filter(Q(nombre__icontains=queryBuscador) | Q(apellido_paterno__icontains=queryBuscador) | Q(apellido_materno__icontains=queryBuscador)).distinct()
                paginate_queryset = self.paginate_queryset(pacientes)
                serializer = self.serializer_class(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
            else:
                pacientes = self.get_queryset()
                paginate_queryset = self.paginate_queryset(pacientes)
                serializer = self.serializer_class(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new Paciente Op
    def post(self, request):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_sucursal(RetrieveUpdateDestroyAPIView):
    serializer_class = SucursalSerializer

    def get_queryset(self, pk):
        try:
            sucursal = Sucursal.objects.get(pk=pk)
        except Sucursal.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return sucursal

    # Get a sucursal
    def get(self, request, pk, *args, **kwargs):
        try:
            sucursal = Sucursal.objects.get(pk=pk)
        except Sucursal.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        sucursal = self.get_queryset(pk)
        serializer = SucursalSerializer(sucursal)
        return Response(serializer.data, status=status.HTTP_200_OK)


    # Update a sucursal
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a sucursal
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_sucursals(ListCreateAPIView):
    serializer_class = SucursalSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
       sucursals = Sucursal.objects.all()
       return sucursals

    # Get all sucursals
    def get(self, request, *args, **kwargs):
        sucursal = self.get_queryset()
        paginate_queryset = self.paginate_queryset(sucursal)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)

    # Create a new sucursal
    def post(self, request):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_estudio(RetrieveUpdateDestroyAPIView):
    serializer_class = EstudioSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            estudio = Estudio.objects.get(pk=pk)
        except Estudio.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return estudio

    # Get a estudio
    def get(self, request, pk, *args, **kwargs):
        try:
            estudio = Estudio.objects.get(pk=pk)
        except Estudio.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        estudio = self.get_queryset(pk)
        if (estudio.Paciente.id==request.user.profile.id_sem):  # If editors is who makes request
            serializer = EstudioSerializer(estudio)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Update a estudio
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }

        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a estudio
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_post_estudios(ListCreateAPIView):
    parser_class = (FileUploadParser,)
    serializer_class = EstudioSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       estudios = Estudio.objects.all()
       return estudios

    # Get all estudios
    def get(self, request, *args, **kwargs):
        estudios = self.get_queryset()
        estudios = estudios.filter(Paciente = request.user.profile.id_sem)
        paginate_queryset = self.paginate_queryset(estudios)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)

    # Create a new estudio
    def post(self, request):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)



class get_delete_update_estudioOp(RetrieveUpdateDestroyAPIView):
    serializer_class = EstudioSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            estudio = Estudio.objects.get(pk=pk)
        except Estudio.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return estudio


    # Get a estudio
    def get(self, request, pk, *args, **kwargs):
        try:
            estudio = Estudio.objects.get(pk=pk)
        except Estudio.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        estudio = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request 
            serializer = EstudioSerializer(estudio)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a estudio
    def put(self, request, pk, *args, **kwargs):
        try:
            estudio = Estudio.objects.get(pk=pk)
        except Estudio.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        estudio = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            serializer = EstudioSerializer(estudio, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a estudio
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_estudiosOp(ListCreateAPIView):
    serializer_class = EstudioSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       estudios = Estudio.objects.all()
       return estudios

    # Get all estudios
    def get(self, request, *args, **kwargs):
        estudios = self.get_queryset()
        idPaciente = False
        idPaciente = self.request.GET.get("paciente")
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            if(idPaciente):
                estudios = estudios.filter(Paciente__id = idPaciente)
                paginate_queryset = self.paginate_queryset(estudios)
                serializer = self.serializer_class(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
            else:
                content = {
                    'status': 'No puedes consultar todos los pacientes'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new estudio
    def post(self, request):
        serializer = EstudioSerializer(data=request.data)
        serializerR = EstudioSerializer(data=request.data)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            if serializer.is_valid():
                serializer.save()
                if(serializerR.is_valid()): 
                    idPaciente = serializerR.data['Paciente']
                    paciente = Paciente.objects.get(id=idPaciente)
                    print(paciente.email)
                    send_mail('Su estudio se encuentra listo','Puede consultar su resultados desde nuestra plataforma en linea www.semin.mx. Agradecemos su confianza.','info@semin.mx',[paciente.email],fail_silently=False,)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_facturacion(RetrieveUpdateDestroyAPIView):
    serializer_class = FacturacionSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            facturacion = Facturacion.objects.get(pk=pk)
        except Facturacion.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return facturacion

    # Get a facturacion
    def get(self, request, pk, *args, **kwargs):
        try:
            facturacion = Facturacion.objects.get(pk=pk)
        except Facturacion.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        facturacion = self.get_queryset(pk)
        if (facturacion.Paciente.id==request.user.profile.id_sem):  # If editors is who makes request
            serializer = FacturacionSerializer(facturacion)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a facturacion
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a facturacion
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_post_facturacions(ListCreateAPIView):
    serializer_class = FacturacionSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       facturacions = Facturacion.objects.all()
       return facturacions


    # Get all facturacions
    def get(self, request, *args, **kwargs):
        facturacions = self.get_queryset()
        facturacions = facturacions.filter(Paciente = request.user.profile.id_sem)
        paginate_queryset = self.paginate_queryset(facturacions)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)


    # Create a new facturacion
    def post(self, request):
        serializer = FacturacionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class get_delete_update_facturacionOp(RetrieveUpdateDestroyAPIView):
    serializer_class = FacturacionSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            facturacion = Facturacion.objects.get(pk=pk)
        except Facturacion.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return facturacion


    # Get a facturacion
    def get(self, request, pk, *args, **kwargs):
        try:
            facturacion = Facturacion.objects.get(pk=pk)
        except Facturacion.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        facturacion = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            serializer = FacturacionSerializer(facturacion)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a facturacion
    def put(self, request, pk, *args, **kwargs):
        try:
            facturacion = Facturacion.objects.get(pk=pk)
        except Facturacion.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        facturacion = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            serializer = FacturacionSerializer(facturacion, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a facturacion
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_facturacionsOp(ListCreateAPIView):
    serializer_class = FacturacionSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       facturacions = Facturacion.objects.all()
       return facturacions

    # Get all facturacions
    def get(self, request, *args, **kwargs):
        facturacions = self.get_queryset()
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            today = datetime.today()
            first = today.replace(day=1)
            lastMonth = first - timedelta(days=1)
            lastMonth = lastMonth.replace(day=1) 
            facturacions = facturacions.filter(creacion__gte= lastMonth)
            paginate_queryset = self.paginate_queryset(facturacions)
            serializer = self.serializer_class(paginate_queryset, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new facturacion
    def post(self, request):
        serializer = FacturacionSerializer(data=request.data)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_tiempoServicio(RetrieveUpdateDestroyAPIView):
    serializer_class = TiempoServicioSerializer

    def get_queryset(self, pk):
        try:
            tiempoServicio = TiempoServicio.objects.get(pk=pk)
        except TiempoServicio.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return tiempoServicio

    # Get a tiempoServicio
    def get(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a tiempoServicio
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a tiempoServicio
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_tiempoServicios(ListCreateAPIView):
    serializer_class = TiempoServicioSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
       tiempoServicios = TiempoServicio.objects.all()
       return tiempoServicios

    # Get all tiempoServicios
    def get(self, request, *args, **kwargs):
        tiempoServicio = self.get_queryset()
        paginate_queryset = self.paginate_queryset(tiempoServicio)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)

    # Create a new tiempoServicio
    def post(self, request):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_citaSucursal(RetrieveUpdateDestroyAPIView):
    serializer_class = CitaSucursalSerializer
#    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            citaSucursal = CitaSucursal.objects.get(pk=pk)
        except CitaSucursal.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return citaSucursal


class get_delete_update_citaSucursal(RetrieveUpdateDestroyAPIView):
    serializer_class = CitaSucursalSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            citaSucursal = CitaSucursal.objects.get(pk=pk)
        except CitaSucursal.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return citaSucursal

    # Get a citaSucursal
    def get(self, request, pk, *args, **kwargs):
        try:
            citaSucursal = CitaSucursal.objects.get(pk=pk)
        except CitaSucursal.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        citaSucursal = self.get_queryset(pk)
        if (citaSucursal.Paciente.id==request.user.profile.id_sem):  # If editors is who makes request
            serializer = CitaSucursalSerializer(citaSucursal)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Update a citaSucursal
    def put(self, request, pk, *args, **kwargs):
        citaSucursal = self.get_queryset(pk)
        try:
            citaSucursal = CitaSucursal.objects.get(pk=pk)
        except citaSucursal.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        print("entramos")
        if (citaSucursal.Paciente.id==request.user.profile.id_sem):  # If editors is who makes request
            serializer = CitaSucursalSerializer(citaSucursal, data=request.data)
            serializerR = CitaSucursalSerializer(data=request.data)
            if serializerR.is_valid():
                estatus = serializerR.data['estatus']
                if estatus == "ACTIVA":
                    mensaje = "Fecha: {} Hora Inicio: {} Hora Final: {} Estudio: {} Sucursal: {} Nombre: {}  {}  {} Fecha de Nacimiento: {} Correo: {} Telefono: {}".format(citaSucursal.fecha_cita ,citaSucursal.hora_inicio ,citaSucursal.hora_final,citaSucursal.prueba,citaSucursal.Sucursal.nombreSucursal,citaSucursal.Paciente.nombre ,citaSucursal.Paciente.apellido_paterno ,citaSucursal.Paciente.apellido_materno,citaSucursal.Paciente.fecha_nacimiento,citaSucursal.Paciente.email,citaSucursal.Paciente.telefonoCasa)
                    if(citaSucursal.prueba == "ORIENTACION MEDICA VIRTUAL"):
                        mensaje = "Nombre: {}  {}  {} Fecha de Nacimiento: {} Correo: {} Telefono: {}".format(citaSucursal.Paciente.nombre ,citaSucursal.Paciente.apellido_paterno ,citaSucursal.Paciente.apellido_materno,citaSucursal.Paciente.fecha_nacimiento,citaSucursal.Paciente.email,citaSucursal.Paciente.telefonoCasa)
                        send_mail('SEMIN - Se ha agendado una asistencia virtual',mensaje,'info@semin.mx',['itzelo.semin@gmail.com'],fail_silently=False,)
                        print("mensaje enviado")
                    if(citaSucursal.Sucursal.id == 2):
                        if(citaSucursal.tipo_cita == "EXTERNA"):
                            print("externa")
                            send_mail('SEMIN - Se ha agendado una cita Externa',mensaje,'info@semin.mx',['teresam.semin@gmail.com', 'mariterem.semin@gmail.com' , 'yisangel@gmail.com'],fail_silently=False,)
                            print("mensaje enviado")
                        else: 
                            print("13 sur")
                            send_mail('SEMIN - Se ha agendado una cita',mensaje,'info@semin.mx',['semin.sucursalmatriz@gmail.com'],fail_silently=False,)
                            print("mensaje enviado")
                            #html_message = render_to_string('email/estudioListo.html', {'id':citaSucursal.id}) 
                            #html_message = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Home page</title></head><body><p>It works</p></body></html>'
                            #send_mail('Su estudio se encuentra listo',mensaje,'info@semin.mx',['yisangel@gmail.com'],fail_silently=False,html_message=html_message)   
                    if(citaSucursal.Sucursal.id == 3):
                        send_mail('SEMIN - Se ha agendado una cita',mensaje,'info@semin.mx',['semin.sucursal5demayo@gmail.com'],fail_silently=False,)
                        if(citaSucursal.id_sala == 29):
                            send_mail('SEMIN - Se ha agendado una cita',mensaje,'info@semin.mx',['jaimem.semin@gmail.com'],fail_silently=False,)
                            send_mail('SEMIN - Se ha agendado una cita',mensaje,'info@semin.mx',['gabrielaguzmandez@gmail.com'],fail_silently=False,)
                        print("mensaje enviado")
                    if(citaSucursal.Sucursal.id == 4):
                        send_mail('SEMIN - Se ha agendado una cita',mensaje,'info@semin.mx',['semin.sucursalxonaca@gmail.com'],fail_silently=False,)
                        print("mensaje enviado")
                    if(citaSucursal.Sucursal.id == 6):
                        send_mail('SEMIN - Se ha agendado una cita',mensaje,'info@semin.mx',['seminamalucan@gmail.com'],fail_silently=False,)
                        print("mensaje enviado")
                    if(citaSucursal.Sucursal.id == 7):
                        send_mail('SEMIN - Se ha agendado una cita',mensaje,'info@semin.mx',['semin.sucursalcruzdelsur@gmail.com'],fail_silently=False,)
                        print("mensaje enviado")
                    if(citaSucursal.Sucursal.id == 8):
                        send_mail('SEMIN - Se ha agendado una cita',mensaje,'info@semin.mx',['semin.sucursalsanalejandro@gmail.com'],fail_silently=False,)
                        print("mensaje enviado")
                    if(citaSucursal.Sucursal.id == 9):
                        send_mail('SEMIN - Se ha agendado una cita',mensaje,'info@semin.mx',['semin.sucursallamargarita@gmail.com'],fail_silently=False,)
                        print("mensaje enviado")
                    if(citaSucursal.Sucursal.id == 10):
                        send_mail('SEMIN - Se ha agendado una cita',mensaje,'info@semin.mx',['semin.sucursal24sur@gmail.com'],fail_silently=False,)
                        print("mensaje enviado")
                    if(citaSucursal.Sucursal.id == 11):
                        send_mail('SEMIN - Se ha agendado una cita',mensaje,'info@semin.mx',['semin.sucursal16deseptiembre@gmail.com'],fail_silently=False,)
                        print("mensaje enviado")
                    if(citaSucursal.Sucursal.id == 12):
                        send_mail('SEMIN - Se ha agendado una cita',mensaje,'info@semin.mx',['clinica.integral.semin@gmail.com'],fail_silently=False,)
                        print("mensaje enviado")
                    if(citaSucursal.Sucursal.id == 13):
                        send_mail('SEMIN - Se ha agendado una cita',mensaje,'info@semin.mx',['semin.amozoc@gmail.com'],fail_silently=False,)
                        print("mensaje enviado")
            if serializer.is_valid():
                serializer.save()
                print("save")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a citaSucursal
    def delete(self, request, pk, *args, **kwargs):
        try:
            citaSucursal = CitaSucursal.objects.get(pk=pk)
        except citaSucursal.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        citaSucursal = self.get_queryset(pk)
        if (citaSucursal.Paciente.id==request.user.profile.id_sem):  # If editors is who makes request
            citaSucursal.delete()
            content = {
                'status': 'NO CONTENT'
            }
            return Response(content, status=status.HTTP_204_NO_CONTENT)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_citaSucursals(ListCreateAPIView):
    serializer_class = CitaSucursalSerializer
#    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       citaSucursals = CitaSucursal.objects.all()
       return citaSucursals

    # Get all citaSucursals
    def get(self, request, *args, **kwargs):
        citaSucursals = self.get_queryset()
        queryFecha = False
        querySalaId = False
        querySucursal = False
        queryEstatus = False
        queryFecha = self.request.GET.get("fecha")
        querySalaId = self.request.GET.get("id")
        querySucursal = self.request.GET.get("sucursal")
        queryEstatus = self.request.GET.get("estatus")
        if(not(queryFecha or querySalaId or querySucursal or queryEstatus or queryEstatus)):
            print("sin variables")
            citaSucursals = citaSucursals.filter(Paciente = request.user.profile.id_sem).order_by('-id')
            paginate_queryset = self.paginate_queryset(citaSucursals)
            serializer = CitaSucursalNameSerializer(paginate_queryset, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            print(queryEstatus)
            if(queryEstatus):
                print("Filtrado por status")
                citaSucursals = citaSucursals.filter(Paciente = request.user.profile.id_sem)
                citaSucursals = citaSucursals.filter(estatus = "CARRITO")
                serializer_class = CitaSucursalNameSerializer
                paginate_queryset = self.paginate_queryset(citaSucursals)
                serializer = CitaSucursalNameSerializer(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
            else:
                if(queryFecha and querySalaId and querySucursal):
                    try:
                        print("entra a filtrado")
                        citaSucursals = citaSucursals.filter(Sucursal__nombreSucursal = querySucursal)
                        querySalaInt= int(querySalaId)
                        citaSucursals = citaSucursals.filter(id_sala = querySalaId)
                        date_format = '%Y-%m-%d'
                        fecha = datetime.strptime(queryFecha, date_format).date()
                        citaSucursals = citaSucursals.filter(fecha_cita=queryFecha)
                        citaSucursals = citaSucursals.filter((Q(estatus="ACTIVA") | Q(estatus="CARRITO")))
                        serializer_class = CitaSucursalNameSerializer
                        paginate_queryset = self.paginate_queryset(citaSucursals)
                        serializer = CitaSucursalNameSerializer(paginate_queryset, many=True)
                        return self.get_paginated_response(serializer.data)
                    except ValueError:
                        print("error de estructura")
                        raise ValidationError(detail='Error en estrucutra de los campos')
                else:
                    print("falta una")
                    raise ValidationError(detail='Falta un campo')

    # Create a new citaSucursal
    def post(self, request):
        paciente = Paciente.objects.get(id=request.user.profile.id_sem)
        serializer = CitaSucursalSerializer(data=request.data)
        serializerR = CitaSucursalSerializer(data=request.data)
        if(serializerR.is_valid()):
            if((serializerR.data['hora_final'])and(serializerR.data['hora_inicio'])and(serializerR.data['fecha_cita'])and(serializerR.data['id_sala'])and(serializerR.data['prueba'])and(serializerR.data['categoria'])and(serializerR.data['Sucursal'])):
                sucursalCita=serializerR.data['Sucursal']
                sucursalIdSala=serializerR.data['id_sala']
                horaFinal=datetime.strptime(serializerR.data['hora_final'], '%H:%M:%S').time()
                horaInicio=datetime.strptime(serializerR.data['hora_inicio'], '%H:%M:%S').time()
                fechaCita=serializerR.data['fecha_cita']
                citas = CitaSucursal.objects.all()
                citas = citas.filter(Sucursal__id = sucursalCita) #change
                citas = citas.filter(fecha_cita = fechaCita)
                sucursal = Sucursal.objects.all()
                sucursal = sucursal.filter(id=sucursalCita)
                hora_apertura = sucursal[0].hora_apertura
                hora_cierre = sucursal[0].hora_cierre
                hora_apertura_sab = sucursal[0].hora_apertura_sab
                hora_cierre_sab = sucursal[0].hora_cierre_sab
                flag=0 #Horario cierre
                flag2=1 #Comparador de citas
                flag3=0 # Horainicio vs HoraFinal
                i=0
                msgStatus="Error"
                if(horaInicio>horaFinal):
                    msgStatus = "Error en la estrucutra de la cita"
                    flag3=1
                while(i<len(citas)):
                    if(((citas[i].estatus=="ACTIVA" or "CARRITO"))and((citas[i].hora_inicio <= horaInicio <= citas[i].hora_final)or(citas[i].hora_inicio <= horaFinal <= citas[i].hora_final))):
                        if(citas[i].id_sala==sucursalIdSala):
                            if(citas[i].estatus=="CANCELADA" or "CERRADA"):
                                print("Entra")
                            else:
                                print("error")
                                flag=1
                                msgStatus = "El horario de esta cita coincide con otra previamente ingresada"
                    i=i+1
                if((hora_apertura <=  horaInicio <= hora_cierre)and(hora_apertura <= horaFinal <= hora_cierre)):
                    flag2=0
                if((hora_apertura_sab <=  horaInicio <= hora_cierre_sab)and(hora_apertura_sab <= horaFinal <= hora_cierre_sab)):
                    flag2=0
                if(flag2):
                    msgStatus = "Esta cita no coincide con los horarios permitidos"
                if (flag or flag2 or flag3):
                    if serializer.is_valid():
                        content = {
                            'status': msgStatus
                        }
                        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    if serializer.is_valid():
                        serializer.save(Paciente=paciente, estatus="CARRITO", creador="Paciente", editor="Paciente")
                        return Response(serializer.data, status=status.HTTP_201_CREATED)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                if serializer.is_valid():
                    serializer.save(Paciente=paciente, estatus="CARRITO", creador="Paciente", editor="Paciente")
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        else:
            content = {
                'status': 'Falta Algún Campo Requerido'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_citaSucursalList(RetrieveUpdateDestroyAPIView):
    serializer_class = CitaSucursalSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    # Get a citaSucursal
    def get(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        
		
    # Update a citaSucursal
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
            
			
    # Delete a citaSucursal
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_citaSucursalsList(ListCreateAPIView):
    serializer_class = CitaSucursalSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       citaSucursals = CitaSucursal.objects.all()
       return citaSucursals

    # Get all citaSucursals
    def get(self, request, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new citaSucursal
    def post(self, request):
        id_list = self.request.GET.getlist('id')
        print(id_list)
        paciente = Paciente.objects.get(id=request.user.profile.id_sem)
        serializer = CitaSucursalSerializer(data=request.data)
        serializerR = CitaSucursalSerializer(data=request.data)
        if(serializerR.is_valid()):
            if(id_list):
                try:
                    for estudio in id_list :
                        promocion = Catalogo.objects.get(id=estudio)
                except CitaSucursal.DoesNotExist:
                    content = {
                        'status': 'Not Found'
                    }
                    return Response(content, status=status.HTTP_404_NOT_FOUND)
                if((serializerR.data['hora_final'])and(serializerR.data['hora_inicio'])and(serializerR.data['fecha_cita'])and(serializerR.data['id_sala'])and(serializerR.data['prueba'])and(serializerR.data['categoria'])and(serializerR.data['Sucursal'])):
                    sucursalCita=serializerR.data['Sucursal']
                    sucursalIdSala=serializerR.data['id_sala']
                    horaFinal=datetime.strptime(serializerR.data['hora_final'], '%H:%M:%S').time()
                    horaInicio=datetime.strptime(serializerR.data['hora_inicio'], '%H:%M:%S').time()
                    fechaCita=serializerR.data['fecha_cita']
                    citas = CitaSucursal.objects.all()
                    citas = citas.filter(Sucursal__id = sucursalCita) #change
                    citas = citas.filter(fecha_cita = fechaCita)
                    sucursal = Sucursal.objects.all()
                    sucursal = sucursal.filter(id=sucursalCita)
                    hora_apertura = sucursal[0].hora_apertura
                    hora_cierre = sucursal[0].hora_cierre
                    hora_apertura_sab = sucursal[0].hora_apertura_sab
                    hora_cierre_sab = sucursal[0].hora_cierre_sab
                    flag=0 #Horario cierre
                    flag2=1 #Comparador de citas
                    flag3=0 # Horainicio vs HoraFinal
                    i=0
                    msgStatus="Error"
                    if(horaInicio>horaFinal):
                        msgStatus = "Error en la estrucutra de la cita"
                        flag3=1
                    while(i<len(citas)):
                        if(((citas[i].estatus=="ACTIVA" or "CARRITO"))and((citas[i].hora_inicio <= horaInicio <= citas[i].hora_final)or(citas[i].hora_inicio <= horaFinal <= citas[i].hora_final))):
                            if(citas[i].id_sala==sucursalIdSala):
                                if(citas[i].estatus=="CANCELADA" or "CERRADA"):
                                    print("Entra")
                                else:
                                    print("error")
                                    flag=1
                                    msgStatus = "El horario de esta cita coincide con otra previamente ingresada"
                        i=i+1
                    if((hora_apertura <=  horaInicio <= hora_cierre)and(hora_apertura <= horaFinal <= hora_cierre)):
                        flag2=0
                    if((hora_apertura_sab <=  horaInicio <= hora_cierre_sab)and(hora_apertura_sab <= horaFinal <= hora_cierre_sab)):
                        flag2=0
                    if(flag2):
                        msgStatus = "Esta cita no coincide con los horarios permitidos"
                    if (flag or flag2 or flag3):
                        if serializer.is_valid():
                            content = {
                                'status': msgStatus
                            }
                            return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        if serializer.is_valid():
                            serializer.save(Paciente=paciente, estatus="CARRITO", creador="Paciente", editor="Paciente")
                            for estudio in id_list :
                                catalogo = Catalogo.objects.get(pk=estudio)
                                sucursal = Sucursal.objects.get(pk=2)
                                if(not(catalogo.prueba==serializerR.data['prueba'])):
                                    if(not(catalogo.categoria=="Audiología" or catalogo.categoria=="Espirometría")):
                                        CitaSucursal.objects.create(prueba = catalogo.prueba ,categoria = catalogo.categoria,precioVenta =0 ,promocion=True ,nombre_promocion=serializerR.data['nombre_promocion'], tipo_cita = "ABIERTA" ,Sucursal = sucursal,Paciente=paciente, estatus="CARRITO", creador="Paciente", editor="Paciente")
                                    else:
                                        CitaSucursal.objects.create(prueba = catalogo.prueba ,categoria = catalogo.categoria,precioVenta =0 ,promocion=True ,nombre_promocion=serializerR.data['nombre_promocion'], tipo_cita = "EXTERNA" ,Sucursal = sucursal,Paciente=paciente, estatus="CARRITO", creador="Paciente", editor="Paciente")
                            return Response(serializer.data, status=status.HTTP_201_CREATED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    if serializer.is_valid():
                        serializer.save(Paciente=paciente, estatus="CARRITO", creador="Paciente", editor="Paciente")
                        for estudio in id_list :
                            catalogo = Catalogo.objects.get(pk=estudio)
                            sucursal = Sucursal.objects.get(pk=2)
                            if(not(catalogo.prueba==serializerR.data['prueba'])):
                                if(not(catalogo.prueba=="Audiologia" or catalogo.prueba=="Espirometria")):
                                    CitaSucursal.objects.create(prueba = catalogo.prueba ,categoria = catalogo.categoria,precioVenta =0 ,promocion=True ,nombre_promocion=serializerR.data['nombre_promocion'], tipo_cita = "ABIERTA" ,Sucursal = sucursal,Paciente=paciente, estatus="CARRITO", creador="Paciente", editor="Paciente")
                                else:
                                    CitaSucursal.objects.create(prueba = catalogo.prueba ,categoria = catalogo.categoria,precioVenta =0 ,promocion=True ,nombre_promocion=serializerR.data['nombre_promocion'], tipo_cita = "EXTERNA" ,Sucursal = sucursal,Paciente=paciente, estatus="CARRITO", creador="Paciente", editor="Paciente")
                        return Response(serializer.data, status=status.HTTP_201_CREATED)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                content = {
                    'status': 'Este método es solamente para crear grupos de cita'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'Falta Algún Campo Requerido'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_CatalogoTop(ListCreateAPIView):
    serializer_class = CatalogoSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
       catalogo = Catalogo.objects.all()
       return catalogo

    # Get all Catalogo
    def get(self, request, *args, **kwargs):
        catalogo = self.get_queryset()
        catalogo = catalogo.order_by('-ranking')
        paginate_queryset = self.paginate_queryset(catalogo)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)


    # Create a new Catalogo
    def post(self, request):
        content = {
            'status': 'No valido'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class cie10Search(ListCreateAPIView):
    serializer_class = Cie10Serializer
    def get_queryset(self, *args, **kwargs):
        queryset_list = Cie10.objects.all()
        query = self.request.GET.get("enfermedad")
        if query:
           queryset_list = queryset_list.filter(
                Q(NOMBRE__icontains=query)
                ).distinct()
           paginator = Paginator(queryset_list, 10)
           response = paginator.page(1)
           return response


class areaSearch(ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CatalogoSerializer
    def get_queryset(self, *args, **kwargs):
        queryset_list = Catalogo.objects.all()
        query = self.request.GET.get("area")
        if query:
           queryset_list = queryset_list.filter(
                Q(area__iexact=query)
                ).distinct()
           return queryset_list

 
class tablaPermisosSearch(ListCreateAPIView):
    serializer_class = TablaPermisosSerializer

    def get_queryset(self, *args, **kwargs):
        queryset_list = TablaPermisos.objects.all()
        query = self.request.GET.get("token")
        if query:
           queryset_list = queryset_list.filter(
                Q(token__iexact=query)
                ).distinct()
           paginator = Paginator(queryset_list, 10)
           response = paginator.page(1)
           return response


class areaSearchAdvance(ListCreateAPIView):
    serializer_class = CatalogoSerializer

    def get_queryset(self, *args, **kwargs):
        all_points_queryset = Catalogo.objects.none()
        try:
            queryset_list = Catalogo.objects.all()
            sentence = self.request.GET.get("sentence")
            areas_list = self.request.GET.getlist('area') 
            word_list= re.findall(r'\w+', sentence)
            print ("Sentence: ",sentence)
            print ("Words: ",*word_list)
            print ("Areas: ",*areas_list)
            

            if(len(word_list)):
                print ("Error")

            #Check if reserver word "All" is in areas_list
            if 'All' in areas_list :
                for word in word_list :
                    print ("Word->"+word)
                    queryset_sentences_in_area = Catalogo.objects.filter(
                                            (Q(prueba__icontains=word) | Q(beneficio__icontains=word ))
                                            )
                    all_points_queryset = all_points_queryset | queryset_sentences_in_area
            else:
                #First filter to areas
                for area in areas_list: 
                    #Second filter to word
                    for word in word_list :
                        print ("Word->"+word)
                        queryset_sentences_in_area = Catalogo.objects.filter(
                                            Q(area=area) & 
                                            (Q(prueba__icontains=word) | Q(beneficio__icontains=word ))
                                            )
                        all_points_queryset = all_points_queryset | queryset_sentences_in_area
            return all_points_queryset.order_by('-ranking')
            
        except:
            raise ValidationError(detail='You must select a area and write 3 characteres')

#FRONT
class get_post_Bolsa(ListCreateAPIView):
    serializer_class = BolsaSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
       bolsa = Bolsa.objects.all()
       return bolsa

    # Get all Bolsa
    def get(self, request, *args, **kwargs):
        bolsa = self.get_queryset()
        paginate_queryset = self.paginate_queryset(bolsa)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)


    # Create a new Bolsa
    def post(self, request):
        content = {
            'status': 'No valido'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_MedicoTop(ListCreateAPIView):
    serializer_class = MedicoSearchSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
       medico = Medico.objects.all()
       return medico

    # Get all Medico
    def get(self, request, *args, **kwargs):
        medico = self.get_queryset()
        medico = medico.filter(verificado = "APROBADO")
        medico = medico.order_by('-ranking')
        paginate_queryset = self.paginate_queryset(medico)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)


    # Create a new Medico
    def post(self, request):
        content = {
            'status': 'No valido'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class medicoSearch(ListCreateAPIView):
    serializer_class = MedicoSearchSerializer
    def get_queryset(self, *args, **kwargs):
        queryset_list = Medico.objects.all()
        queryset_list = queryset_list.filter(verificado = "APROBADO")
        especialidad = self.request.GET.get("especialidad")
        estado = self.request.GET.get("estado")
        print(especialidad)
        print(estado)
        if estado:
           queryset_list = queryset_list.filter(
                Q(estado__iexact=estado)
                ).distinct()
        if especialidad:
           queryset_list = queryset_list.filter(
                Q(especialidad__iexact=especialidad)
                ).distinct()
        queryset_list.order_by('-ranking')
        paginator = Paginator(queryset_list, 40)
        response = paginator.page(1)
        return response


class medicoIdSearch(ListCreateAPIView):
    serializer_class = MedicoSearchSerializer
    def get_queryset(self, *args, **kwargs):
        queryset_list = Medico.objects.all()
        queryset_list = queryset_list.filter(verificado = "APROBADO")
        id = self.request.GET.get("id")
        print(id)
        if id:
           queryset_list = queryset_list.filter(
                Q(id__iexact=id)
                ).distinct()
        return queryset_list


class medicoEmailSearch(ListCreateAPIView):
    serializer_class = MedicoSearchSerializer
    def get_queryset(self, *args, **kwargs):
        queryset_list = Medico.objects.all()
        queryset_list = queryset_list.filter(verificado = "APROBADO") 
        email = self.request.GET.get("email")
        print(email)
        if email:
           queryset_list = queryset_list.filter(
                Q(email__iexact=email)
                ).distinct()
        return queryset_list


class pacienteEmailSearch(ListCreateAPIView):
    serializer_class = PacienteSearchRegisterSerializer
    def get_queryset(self, *args, **kwargs):
        queryset_list = Paciente.objects.all()
        email = self.request.GET.get("email")
        print(email)
        if email:
           queryset_list = queryset_list.filter(
                Q(email__iexact=email)
                ).distinct()
        return queryset_list


class EstudioEmpresaSearch(ListCreateAPIView):
    serializer_class = EstudioEmpresaSearchSerializer
    def get_queryset(self, *args, **kwargs):
        queryset_list = EstudioEmpresa.objects.all()
        usuario = self.request.GET.get("usuario")
        print(usuario)
        if usuario:
           queryset_list = queryset_list.filter(
                Q(usuario__iexact=usuario)
                ).distinct()
        return queryset_list


class EstudioEmpresaSearchExterno(ListCreateAPIView):
    serializer_class = EstudioEmpresaSearchExternoSerializer
    def get_queryset(self, *args, **kwargs):
        queryset_list = EstudioEmpresa.objects.all()
        usuario = self.request.GET.get("usuario")
        password = self.request.GET.get("password")
        solicitud = self.request.GET.get("solicitud")
        print(usuario)
        print(password)
        print(solicitud)
        try:
            queryset_list = queryset_list.filter(
                Q(usuario__iexact=usuario)
                ).distinct()
            queryset_list = queryset_list.filter(
                Q(password__iexact=password)
                ).distinct()
            queryset_list = queryset_list.filter(
                Q(solicitud__iexact=solicitud)
                ).distinct()
            return queryset_list
        except:
            raise ValidationError(detail='Consulta no realizada')

class citaMedicoSearch(ListCreateAPIView):
    serializer_class = CitaMedicoSearchSerializer
    def get_queryset(self, *args, **kwargs):
        queryset_list = CitaMedico.objects.all()
        id_medico = self.request.GET.get("id")
        fecha_cita = self.request.GET.get("fecha")
        print(fecha_cita)
        print(id_medico)
        if id_medico:
            print("medico")
            queryset_list = queryset_list.filter(
                Q(Medico__id__iexact=id_medico)
                ).distinct() 
        if fecha_cita:
            print("fecha")
            queryset_list = queryset_list.filter(
                Q(fecha_cita__iexact=fecha_cita)
                ).distinct()
        print("ok")
        paginator = Paginator(queryset_list, 999999)
        response = paginator.page(1)
        return response



class categorySearchAdvance(ListCreateAPIView):
    serializer_class = CatalogoSerializer

    def get_queryset(self, *args, **kwargs):
        all_points_queryset = Catalogo.objects.none()
        try:
            queryset_list = Catalogo.objects.all()
            sentence = self.request.GET.get("sentence")
            categories_list = self.request.GET.getlist('category') 
            word_list= re.findall(r'\w+', sentence)
            print ("Sentence: ",sentence)
            print ("Words: ",*word_list)
            print ("Categorias: ",*categories_list)
            

            if(len(word_list)):
                print ("Error")

            #Check if reserver word "All" is in areas_list
            if 'All' in categories_list :
                for word in word_list :
                    print ("Word->"+word)
                    if(word != "de" and word !="con"  and word !="hasta"  and word !="a"  ) :
                        queryset_sentences_in_category = Catalogo.objects.filter(
                                            (Q(prueba__icontains=word) | Q(beneficio__icontains=word ))
                                            )
                        all_points_queryset = all_points_queryset | queryset_sentences_in_category 
            else:
                #First filter to areas
                for category in categories_list: 
                    #Second filter to word
                    for word in word_list :
                        print ("Word->"+word)
                        queryset_sentences_in_category = Catalogo.objects.filter(
                                            Q(categoria=category) & 
                                            (Q(prueba__icontains=word) | Q(beneficio__icontains=word ))
                                            )
                        all_points_queryset = all_points_queryset | queryset_sentences_in_category
            all_points_queryset=all_points_queryset.order_by('-ranking')
            paginator = Paginator(all_points_queryset, 30)
            response = paginator.page(1)
            return response
        except:
            raise ValidationError(detail='You must select a category and write 3 characteres')


class deteleMoreThan30(ListCreateAPIView):
    serializer_class = CitaSucursalSerializer

    def get_queryset(self):
       citaSucursals = CitaSucursal.objects.all()
       return citaSucursals

           # Get all citaSucursals 
    def get(self, request, *args, **kwargs):

        citaSucursals = self.get_queryset()
        time_threshold = datetime.now() - timedelta(minutes=30)
        #citaSucursals= citaSucursals.filter(estatus="CARRITO")
        #citaSucursals= citaSucursals.filter(creacion__lt=time_threshold)
        #citaSucursals.delete()
        serializer = self.serializer_class(citaSucursals, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
 

class get_delete_update_profile(RetrieveUpdateDestroyAPIView):
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:

            profile = Profile.objects.get(pk=pk)
        except profile.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return profile

    # Get a profile
    def get(self, request, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Update a profile
    def put(self, request, *args, **kwargs):
        try:
            profile = Profile.objects.get(pk=request.user.profile.id)
        except Profile.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        profile = self.get_queryset(request.user.profile.id)
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

		
    # Delete a profile
    def delete(self, request, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_profiles(ListCreateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    # Get profiles
    def get(self, request, *args, **kwargs):
        try:
            profile = Profile.objects.get(pk=request.user.profile.id)
        except Profile.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        profile = Profile.objects.get(pk=request.user.profile.id)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


    # Create a new Profile
    def post(self, request):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_delete_update_empleado(RetrieveUpdateDestroyAPIView):
    serializer_class = EmpleadoSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            empleado = Empleado.objects.get(pk=pk)
        except Empleado.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return empleado

    # Get a empleado
    def get(self, request, pk, *args, **kwargs):
        try:
            empleado = Empleado.objects.get(pk=pk)
        except Empleado.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        empleado = self.get_queryset(pk)
        if(request.user in empleado.editors.all()): # If editors is who makes request
            serializer = EmpleadoSerializer(empleado)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                    'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a empleado
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a empleado
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_empleados(ListCreateAPIView):
    serializer_class = EmpleadoSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       empleados = Empleado.objects.all()
       return empleados

    # Get all empleados
    def get(self, request, *args, **kwargs):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new Empleado
    def post(self, request):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_almacenista(RetrieveUpdateDestroyAPIView):
    serializer_class = AlmacenistaSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            almacenista = Almacenista.objects.get(pk=pk)
        except Almacenista.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return almacenista

    # Get a almacenista
    def get(self, request, pk, *args, **kwargs):
        try:
            almacenista = Almacenista.objects.get(pk=pk)
        except Almacenista.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        almacenista = self.get_queryset(pk)
        if(request.user in almacenista.editors.all()): # If editors is who makes request
            serializer = AlmacenistaSerializer(almacenista)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                    'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a almacenista
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a almacenista
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_almacenistas(ListCreateAPIView):
    serializer_class = AlmacenistaSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       almacenistas = Almacenista.objects.all()
       return almacenistas

    # Get all almacenistas
    def get(self, request, *args, **kwargs):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new Almacenista
    def post(self, request):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_jefeSucursal(RetrieveUpdateDestroyAPIView):
    serializer_class = JefeSucursalSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            jefeSucursal = JefeSucursal.objects.get(pk=pk)
        except JefeSucursal.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return jefeSucursal

    # Get a jefeSucursal
    def get(self, request, pk, *args, **kwargs):
        try:
            jefeSucursal = JefeSucursal.objects.get(pk=pk)
        except JefeSucursal.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        jefeSucursal = self.get_queryset(pk)
        if(request.user in jefeSucursal.editors.all()): # If editors is who makes request
            serializer = JefeSucursalSerializer(jefeSucursal)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                    'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a jefeSucursal
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a jefeSucursal
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_jefeSucursals(ListCreateAPIView):
    serializer_class = JefeSucursalSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       jefeSucursals = JefeSucursal.objects.all()
       return jefeSucursals

    # Get all jefeSucursals
    def get(self, request, *args, **kwargs):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new JefeSucursal
    def post(self, request):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_disponibilidadServicio(RetrieveUpdateDestroyAPIView):
    serializer_class = DisponibilidadServicioSerializer
    
    def get_queryset(self, pk):
        try:
            disponibilidadServicio = DisponibilidadServicio.objects.get(pk=pk)
        except DisponibilidadServicio.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return disponibilidadServicio

    # Get a disponibilidadServicio
    def get(self, request, pk, *args, **kwargs):
        try:
            disponibilidadServicio = DisponibilidadServicio.objects.get(pk=pk)
        except DisponibilidadServicio.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        disponibilidadServicio = self.get_queryset(pk)        
        serializer = DisponibilidadServicioSerializer(disponibilidadServicio)
        return Response(serializer.data, status=status.HTTP_200_OK)

		
    # Update a disponibilidadServicio
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a disponibilidadServicio
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_post_disponibilidadServicios(ListCreateAPIView):
    serializer_class = DisponibilidadServicioSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
        disponibilidadServicios = DisponibilidadServicio.objects.all()
        return disponibilidadServicios

    # Get all disponibilidadServicios
    def get(self, request, *args, **kwargs):
        disponibilidadServicios = self.get_queryset()
        query = self.request.GET.get("sala")
        queryId = self.request.GET.get("id")
        if(query):
            print(query)
            if query == 'Sang':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(Sang = 0))
            elif query  == 'Esp':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(Esp = 0))
            elif query  == 'US':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(US = 0))
            elif query  == 'USD':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(USD = 0))
            elif query  == 'RXS':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(RXS = 0))
            elif query  == 'RXC':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(RXC = 0))
            elif query  == 'Masto':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(Masto = 0))
            elif query  == 'Card':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(Card = 0))
            elif query  == 'TAC':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(TAC = 0))
            elif query  == 'RM':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(RM = 0))
            elif query  == 'Colpo':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(Colpo = 0))
            elif query  == 'Densi':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(Densi = 0))
            elif query  == 'Espiro':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(Espiro = 0))
            elif query  == 'Cons':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(Cons = 0))
            elif query  == 'Pato':
                disponibilidadServicios = disponibilidadServicios.filter(~Q(Pato = 0))
            else:
                disponibilidadServicios = disponibilidadServicios.filter(id = 0)
                paginate_queryset = self.paginate_queryset(disponibilidadServicios)
                serializer = self.serializer_class(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
        if(queryId):
            disponibilidadServicios = disponibilidadServicios.filter(Sucursal__id = queryId)
        paginate_queryset = self.paginate_queryset(disponibilidadServicios)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)


    # Create a new disponibilidadServicio
    def post(self, request):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_citaSucursalOp(RetrieveUpdateDestroyAPIView):
    serializer_class = CitaSucursalSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            citaSucursal = CitaSucursal.objects.get(pk=pk)
        except CitaSucursal.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return citaSucursal


class get_delete_update_citaSucursalOp(RetrieveUpdateDestroyAPIView):
    serializer_class = CitaSucursalSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)
  
    def get_queryset(self, pk):
        try:
            citaSucursal = CitaSucursal.objects.get(pk=pk)
        except CitaSucursal.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return citaSucursal

    # Get a citaSucursal
    def get(self, request, pk, *args, **kwargs):
        try:
            citaSucursal = CitaSucursal.objects.get(pk=pk)
        except CitaSucursal.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        citaSucursal = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"):  # If editors is who makes request
            serializer = CitaSucursalSerializer(citaSucursal)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Update a citaSucursal
    def put(self, request, pk, *args, **kwargs):
        try:
            citaSucursal = CitaSucursal.objects.get(pk=pk)
        except citaSucursal.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        citaSucursal = self.get_queryset(pk)
        if (request.user.profile.tipo == "Operador"):  # If editors is who makes request
            serializer = CitaSucursalSerializer(citaSucursal, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a citaSucursal
    def delete(self, request, pk, *args, **kwargs):
        try:
            citaSucursal = CitaSucursal.objects.get(pk=pk)
        except citaSucursal.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        citaSucursal = self.get_queryset(pk)
        if (request.user.profile.tipo == Operador):  # If editors is who makes request
            citaSucursal.delete()
            content = {
                'status': 'NO CONTENT'
            }
            return Response(content, status=status.HTTP_204_NO_CONTENT)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_citaSucursalsOp(ListCreateAPIView):
    serializer_class = CitaSucursalSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
        citaSucursals = CitaSucursal.objects.all()
        return citaSucursals

    # Get all citaSucursals
    def get(self, request, *args, **kwargs):
        if (request.user.profile.tipo =="Operador"):  # If editors is who makes request
            citaSucursals = self.get_queryset()
            queryBuscador = False
            querySalaId = False
            querySucursal = False
            queryEstatus = False
            queryTipo = False
            queryRembolso = False
            queryBuscador = self.request.GET.get("buscador")
            querySalaId = self.request.GET.get("id")
            querySucursal = self.request.GET.get("sucursal")
            queryEstatus = self.request.GET.get("estatus")
            queryTipo = self.request.GET.get("tipo")
            queryRembolso = self.request.GET.get("rembolso")
            queryFacturacion = self.request.GET.get("facturacion")
            if(queryRembolso=="TRUE"):
                print("filtrado por rembolso")
                print(queryRembolso) 
                citaSucursals = citaSucursals.filter((Q(estatus_rembolso="SOLICITADO") | Q(estatus_rembolso="APROBADO") | Q(estatus_rembolso="RECHAZADO")))
                paginate_queryset = self.paginate_queryset(citaSucursals)
                serializer = CitaSucursalPacienteSerializer(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
            else:
                if(not(querySalaId or querySucursal or queryEstatus)):
                    if(queryTipo):
                        print("filtrando por tipo")
                        print(queryTipo)
                        if(queryTipo=="ABIERTA"):
                            print("abierta")
                            citaSucursals = citaSucursals.filter(Sucursal__nombreSucursal = "13 Sur")
                            citaSucursals = citaSucursals.filter(tipo_cita = "ABIERTA")
                            paginate_queryset = self.paginate_queryset(citaSucursals)
                            serializer = CitaSucursalPacienteSerializer(paginate_queryset, many=True)
                            return self.get_paginated_response(serializer.data)
                        if(queryTipo=="EXTERNA"):
                            print("externa")
                            citaSucursals = citaSucursals.filter(Sucursal__nombreSucursal = "13 Sur")
                            citaSucursals = citaSucursals.filter(tipo_cita = "EXTERNA")
                            paginate_queryset = self.paginate_queryset(citaSucursals)
                            serializer = CitaSucursalPacienteSerializer(paginate_queryset, many=True)
                            return self.get_paginated_response(serializer.data)
                        else:
                            print("sin variables")
                            content = {
                                'status': 'Tipo no existente'
                            }
                            return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                    else:
                        print("sin variables") 
                        content = {
                            'status': 'No puedes llamar todas las citas'
                        }
                        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                else:
                    print(queryEstatus)
                    if(queryEstatus):
                        print("filtrado por estatus")
                        content = {
                            'status': 'No puedes llamar todas las citas'
                        }
                        return self.get_paginated_response(serializer.data)
                    else:
                        if(querySalaId and querySucursal):
                            try:
                                print("filtrado normal")
                                citaSucursals = citaSucursals.filter(Sucursal__nombreSucursal = querySucursal)
                                querySalaInt= int(querySalaId)
                                citaSucursals = citaSucursals.filter(id_sala = querySalaId)
                                if(queryBuscador):
                                    print("buscador")
                                    citaSucursals = citaSucursals.filter(tipo_cita = "AGENDADA") 
                                if(not(queryBuscador)):
                                    print("normal")
                                    today = datetime.today()
                                    first = today.replace(day=1)
                                    lastMonth = first - timedelta(days=1)
                                    lastMonth = lastMonth.replace(day=1)
                                    citaSucursals = citaSucursals.filter(fecha_cita__gte= lastMonth)
                                serializer_class = CitaSucursalNameSerializer
                                paginate_queryset = self.paginate_queryset(citaSucursals)
                                serializer = CitaSucursalPacienteSerializer(paginate_queryset, many=True)
                                return self.get_paginated_response(serializer.data)
                            except ValueError:
                                print("error de estructura")
                                raise ValidationError(detail='Error en estrucutra de los campos')
                        else:
                            print("falta una")
                            raise ValidationError(detail='Falta un campo')
        else:
            content = {
                'status': 'Usuario no Autorizado'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new citaSucursal
    def post(self, request):
        print("entra")
        serializer = CitaSucursalSerializer(data=request.data)
        serializerR = CitaSucursalSerializer(data=request.data)
        if(serializerR.is_valid()):
            if (request.user.profile.tipo =="Operador"):  # If editors is who makes request
                if((serializerR.data['hora_final'])and(serializerR.data['hora_inicio'])and(serializerR.data['fecha_cita'])and(serializerR.data['id_sala'])):
                    sucursalCita=serializerR.data['Sucursal']
                    sucursalIdSala=serializerR.data['id_sala']
                    horaFinal=datetime.strptime(serializerR.data['hora_final'], '%H:%M:%S').time()
                    horaInicio=datetime.strptime(serializerR.data['hora_inicio'], '%H:%M:%S').time()
                    fechaCita=serializerR.data['fecha_cita']
                    citas = CitaSucursal.objects.all()
                    citas = citas.filter(Sucursal__id = sucursalCita) #change
                    citas = citas.filter(fecha_cita = fechaCita)
                    sucursal = Sucursal.objects.all()
                    sucursal = sucursal.filter(id=sucursalCita)
                    hora_apertura = sucursal[0].hora_apertura
                    hora_cierre = sucursal[0].hora_cierre
                    hora_apertura_sab = sucursal[0].hora_apertura_sab
                    hora_cierre_sab = sucursal[0].hora_cierre_sab
                    flag=0 #Horario cierre
                    flag2=1 #Comparador de citas
                    flag3=0 # Horainicio vs HoraFinal
                    i=0
                    msgStatus="Error"
                    if(horaInicio>horaFinal):
                        msgStatus = "Error en la estrucutra de la cita"
                        flag3=1
                    while(i<len(citas)):
                        if(citas[i].estatus=="ACTIVA" or "CARRITO"):
                            if((citas[i].hora_inicio <= horaInicio <= citas[i].hora_final)or(citas[i].hora_inicio <= horaFinal <= citas[i].hora_final)):
                                if(citas[i].id_sala==sucursalIdSala):
                                    if((citas[i].estatus=="CERRADA") or (citas[i].estatus=="CANCELADA")):
                                        print("no procede")
                                    else:
                                        print("error")
                                        print(citas[i].id)
                                        flag=1
                                        msgStatus = "El horario de esta cita coincide con otra previamente ingresada"
                        i=i+1
                    if((hora_apertura <=  horaInicio <= hora_cierre)and(hora_apertura <= horaFinal <= hora_cierre)):
                        flag2=0
                    if((hora_apertura_sab <=  horaInicio <= hora_cierre_sab)and(hora_apertura_sab <= horaFinal <= hora_cierre_sab)):
                        flag2=0
                    if(flag2):
                        msgStatus = "Esta cita no coincide con los horarios permitidos"
                    if (flag or flag3):
                        if serializer.is_valid():
                            content = {
                                'status': msgStatus
                            }
                            return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        if serializer.is_valid():
                            serializer.save()
                            return Response(serializer.data, status=status.HTTP_201_CREATED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    if serializer.is_valid():
                        serializer.save()
                        return Response(serializer.data, status=status.HTTP_201_CREATED)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                content = {
                    'status': 'Usuario no permitido'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'Error de estrucutra'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_post_citaSucursalMedicos(ListCreateAPIView):
    serializer_class = CitaSucursalSerializer
#    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       citaSucursals = CitaSucursal.objects.all()
       return citaSucursals

    # Get all citaSucursals
    def get(self, request, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        
    # Create a new citaSucursal
    def post(self, request):
        serializer = CitaSucursalSerializer(data=request.data)
        serializerR = CitaSucursalSerializer(data=request.data)
        if(serializerR.is_valid()):
            if (request.user.profile.tipo =="Medico"):  # If editors is who makes request
                if((serializerR.data['hora_final'])and(serializerR.data['hora_inicio'])and(serializerR.data['fecha_cita'])and(serializerR.data['id_sala'])and(serializerR.data['prueba'])and(serializerR.data['categoria'])and(serializerR.data['Sucursal'])):
                    sucursalCita=serializerR.data['Sucursal']
                    sucursalIdSala=serializerR.data['id_sala']
                    horaFinal=datetime.strptime(serializerR.data['hora_final'], '%H:%M:%S').time()
                    horaInicio=datetime.strptime(serializerR.data['hora_inicio'], '%H:%M:%S').time()
                    fechaCita=serializerR.data['fecha_cita']
                    citas = CitaSucursal.objects.all()
                    citas = citas.filter(Sucursal__id = sucursalCita) #change
                    citas = citas.filter(fecha_cita = fechaCita)
                    sucursal = Sucursal.objects.all()
                    sucursal = sucursal.filter(id=sucursalCita)
                    hora_apertura = sucursal[0].hora_apertura
                    hora_cierre = sucursal[0].hora_cierre
                    hora_apertura_sab = sucursal[0].hora_apertura_sab
                    hora_cierre_sab = sucursal[0].hora_cierre_sab
                    flag=0 #Horario cierre
                    flag2=1 #Comparador de citas
                    flag3=0 # Horainicio vs HoraFinal
                    i=0
                    msgStatus="Error"
                    if(horaInicio>horaFinal):
                        msgStatus = "Error en la estrucutra de la cita"
                        flag3=1
                    while(i<len(citas)):
                        if(((citas[i].estatus=="ACTIVA" or "CARRITO"))and((citas[i].hora_inicio <= horaInicio <= citas[i].hora_final)or(citas[i].hora_inicio <= horaFinal <= citas[i].hora_final))):
                            if(citas[i].id_sala==sucursalIdSala):
                                if(citas[i].estatus=="CANCELADA" or "CERRADA"):
                                    print("Entra")
                                else:
                                    print("error")
                                    flag=1
                                    msgStatus = "El horario de esta cita coincide con otra previamente ingresada"
                        i=i+1
                    if((hora_apertura <=  horaInicio <= hora_cierre)and(hora_apertura <= horaFinal <= hora_cierre)):
                        flag2=0
                    if((hora_apertura_sab <=  horaInicio <= hora_cierre_sab)and(hora_apertura_sab <= horaFinal <= hora_cierre_sab)):
                        flag2=0
                    if(flag2):
                        msgStatus = "Esta cita no coincide con los horarios permitidos"
                    if (flag or flag2 or flag3):
                        if serializer.is_valid():
                            content = {
                                'status': msgStatus
                            }
                            return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        if serializer.is_valid():
                            serializer.save()
                            return Response(serializer.data, status=status.HTTP_201_CREATED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    if serializer.is_valid():
                        serializer.save()
                        return Response(serializer.data, status=status.HTTP_201_CREATED)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                content = {
                    'status': 'Usuario no autorizado'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
					
        else:
            content = {
                'status': 'Falta Algún Campo Requerido'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_delete_update_carrousel(RetrieveUpdateDestroyAPIView):
    serializer_class = CarrouselSerializer

    def get_queryset(self, pk):
        try:
            Carrousel = Carrousel.objects.get(pk=pk)
        except Carrousel.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return Carrousel

    # Get a Carrousel
    def get(self, request, pk, *args, **kwargs):
        try:
            Carrousel = Carrousel.objects.get(pk=pk)
        except Carrousel.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        Carrousel = self.get_queryset(pk)
        fecha = date.today()
        print(fecha)
        if(Carrousel.caducidad < fecha):
            serializer = CarrouselSerializer(Carrousel)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a Carrousel
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a Carrousel
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_carrousels(ListCreateAPIView):
    serializer_class = CarrouselSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
       Carrousels = Carrousel.objects.all()
       return Carrousels

    # Get all Carrousels
    def get(self, request, *args, **kwargs):
        Carrousel = self.get_queryset()
        fecha = date.today()
        Carrousel = Carrousel.filter(caducidad__gt = fecha)
        paginate_queryset = self.paginate_queryset(Carrousel)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)

    # Create a new Carrousel
    def post(self, request):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_promocion(RetrieveUpdateDestroyAPIView):
    serializer_class = PromocionSerializer

    def get_queryset(self, pk):
        try:
            promocion = Promocion.objects.get(pk=pk)
        except Promocion.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return promocion

    # Get a promocion
    def get(self, request, pk, *args, **kwargs):
        try:
            promocion = Promocion.objects.get(pk=pk)
        except Promocion.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        promocion = self.get_queryset(pk)
        fecha = date.today()
        print(fecha)
        if(promocion.caducidad < fecha):
            serializer = PromocionSerializer(promocion)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a promocion
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a promocion
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_promocions(ListCreateAPIView):
    serializer_class = PromocionSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
       promocions = Promocion.objects.all()
       return promocions

    # Get all promocions
    def get(self, request, *args, **kwargs):
        promocion = self.get_queryset()
        fecha = date.today()
        promocion = promocion.filter(caducidad__gt = fecha)
        paginate_queryset = self.paginate_queryset(promocion)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)

    # Create a new promocion
    def post(self, request):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class promocionTicketSearch(ListCreateAPIView):  
    serializer_class = PromocionTicketSerializer

    def get_queryset(self, *args, **kwargs): 
        queryset_list = PromocionTicket.objects.all()
        query = self.request.GET.get("nombre")
        registro = self.request.GET.get("registro")
        if(registro):
            queryset_list = queryset_list.filter(registro = "True")
            queryset_list = queryset_list.filter(
                Q(registro="True")
                ).distinct()
            paginator = Paginator(queryset_list, 10)
            response = paginator.page(1)
            return response
        else:
            if query: 
                queryset_list = queryset_list.filter(
                    Q(titulo__iexact=query)
                    ).distinct()
                paginator = Paginator(queryset_list, 10)
                response = paginator.page(1)
                return response


class promocionTicketSubtract(ListCreateAPIView):
    serializer_class = PromocionTicketSerializer
    def get_queryset(self, *args, **kwargs):
        query = self.request.GET.get("id")
        if query:
            promocionTicket = PromocionTicket.objects.all()
            promocionTicket = promocionTicket.filter(id = query)
            print(len(promocionTicket))
            if(len(promocionTicket)):
                print("iteracion")
                num = promocionTicket[0].numVentas
                num=num-1
                promocionTicket[0].numVentas = num
                promocionTicket[0].save()
                paginate_queryset = self.paginate_queryset(promocionTicket)
                serializer = self.serializer_class(paginate_queryset, many=True)




class get_delete_update_catalogo(RetrieveUpdateDestroyAPIView):
    serializer_class = CatalogoSerializer

    def get_queryset(self, pk):
        try:
            catalogo = Catalogo.objects.get(pk=pk)
        except Catalogo.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return catalogo

    # Get a catalogo
    def get(self, request, pk, *args, **kwargs):
        try:
            catalogo = Catalogo.objects.get(pk=pk)
        except Catalogo.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        serializer = CatalogoSerializer(catalogo)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Update a catalogo
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a catalogo
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_catalogos(ListCreateAPIView):
    serializer_class = CatalogoSerializer
    pagination_class = CustomPagination

    # Get all catalogos
    def get(self, request, *args, **kwargs):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new catalogo
    def post(self, request):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

# Payment Views.

class get_post_update_payment(RetrieveUpdateDestroyAPIView):

    def get(self, request,*args, **kwargs):
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

        openpay.api_key = "sk_2a3fbb7507f14a31a21e74a029c5e31e"
        openpay.verify_ssl_certs = False
        openpay.merchant_id = "mctgixozmyhtgrdhorel"

        try:
            customer = openpay.Customer.retrieve('amce5ycvwycfzyarjf8l')
            print ("customer: "+customer)
            content = {
                'status': 'Good',
                'customer': customer
            }
            return Response(content, status=status.HTTP_200_OK)

        except openpay.error.InvalidRequestError as e:
            print('Failed : ->'+ str(e) +"<-") 
            content = {'status': '401',
                        'error': { "code":"p-01", "message":"No existe cliente con este id" }
                }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    def handle_api_error(self, rbody, rcode, resp):
        err = resp

        if rcode in [400, 404]:
            msg = err.get('description') + ", error code: " + str(
                resp['error_code'])
            raise error.InvalidRequestError(
                msg, err.get('request_id'), rbody, rcode, resp)
        elif rcode == 401:
            raise error.AuthenticationError(
                err.get('description'), rbody, rcode, resp)
        elif rcode == 402:
            raise error.CardError(
                err.get('description'), err.get('request_id'),
                err.get('error_code'), rbody, rcode, resp)
        else:
            raise error.APIError(
                "{0}, error code: {1}".format(err.get(
                    'description'),
                    resp['error_code']), rbody, rcode, resp)

    def post(self, request):
        content = {
            'status': 'Good'
        }
        return Response(content, status=status.HTTP_200_OK)

class get_post_update_charge(ListCreateAPIView):

    permission_classes = (IsAuthenticated,)

    def post(self, request):  
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

        openpay.api_key = "sk_2a3fbb7507f14a31a21e74a029c5e31e"
        openpay.verify_ssl_certs = False
        openpay.merchant_id = "mctgixozmyhtgrdhorel"
        data=request.data
        print(data)
        print(type(data))
        print(data["source_id"])
        try:
            source_id = data["source_id"]
            amount = str(data["amount"])
            description = data["description"]
            order_id = data["order_id"]
            
            device_session_id = data["device_session_id"]
            name = data["name"]
            last_name = data["last_name"]
            email = data["email"]
            #print("Datasss",source_id, amount, description, order_id, device_session_id, name, last_name, email)
     

                
            #print("aRRASY",ids_array)
            
            try :
                headers = {'Content-type': 'application/json',}
                data = '{\n   "source_id" : "'+source_id+'",\n   "method" : "card",\n   "amount" : '+amount+' ,\n   "currency" : "MXN",\n   "description" : "Pago de servicios semin.",\n   "device_session_id" : "'+device_session_id+'",\n   "customer" : {\n        "name" : "'+name+'",\n        "last_name" : "'+last_name+'",\n        "email" : "'+email+'"\n   }\n}'
                response = requests.post('https://sandbox-api.openpay.mx/v1/mctgixozmyhtgrdhorel/charges', headers=headers, data=data, auth=('sk_2a3fbb7507f14a31a21e74a029c5e31e', ''))
                #print("RESULT_CODE" + str(response.status_code))
                print("####RESULT curl: ", (response.json() ))

                try:
                    json_response=response.json()
                    id_payment=json_response["id"]
                    print (id_payment)
                except: 
                    print ("NO id_payment")
                    
                #Verified response:
                if response.status_code == 200:
                    """ Get array of ids """
                    ids_array=json.loads(order_id)
               
                    for element in ids_array:
                        print ("id_",element['item'])
                        id_appointment= int(element['item'])
                        """ Update values CARRITO to ACTIVA"""
                        cita = CitaSucursal.objects.get(pk=id_appointment)
                        cita.estatus="ACTIVA"
                        cita.id_pago=str(id_payment)
                        cita.save()
                    
                    content = {'status': '200',
                        'description': 'Pago realizado exitosamente.'
                    }
                    return Response(content, status=status.HTTP_200_OK)
                elif response.status_code == 402:
                    error_description=""
                    error_body=str(response.content)
                    
                    my_json=response.content.decode('utf8').replace("'t", '')
                    my_json =my_json.replace("'", '"')
                    data_resonse=json.loads(my_json)
                    error_code= data_resonse['error_code'];
                    #print("Code error", data_resonse['error_code'], type( data_resonse['error_code']))
                    #print("Body error: ", error_body)

                    if (error_code==1018):
                        error_description="Haz realizado demasiadas peticiones de pago. Intenta más tarde."
                    elif (error_code==3001):
                        error_description="La tarjeta fue rechazada."
                    elif (error_code==3002):
                        error_description="La tarjeta ha expirado."
                    elif (error_code==3003):
                        error_description="La tarjeta no tiene fondos suficientes."
                    elif (error_code==3004):
                        error_description="La tarjeta ha sido identificada como una tarjeta robada."
                    elif (error_code==3005):
                        error_description="La tarjeta ha sido rechazada por el sistema antifraudes."
                    elif (error_code==3005):
                        error_description="La tarjeta ha sido rechazada por el sistema antifraudes."

                    content = {'status': '402',
                        'description': error_description
                    }
                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)
            
            except Exception as e :
                #print('Error en el sistema de pagos: ->'+str(e)+"<-") 
                content = {'status': '401',
                        'description': 'Error en el sistema de pagos, comunicate con el departamento de cobros'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
  
     
        except: 
             content = {
            'status': 'Error'
            }
             return Response(content, status=status.HTTP_200_OK)

        content = {
            'status': 'Good'
        }
        return Response(content, status=status.HTTP_200_OK)


class get_delete_update_primeraEncuesta(RetrieveUpdateDestroyAPIView):
    serializer_class = PrimeraEncuestaSerializer

    def get_queryset(self, pk):
        try:
            primeraEncuesta = PrimeraEncuesta.objects.get(pk=pk)
        except PrimeraEncuesta.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return primeraEncuesta

    # Get a primeraEncuesta
    def get(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
		

    # Update a primeraEncuesta
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a primeraEncuesta
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_post_primeraEncuestasPaciente(ListCreateAPIView):
    serializer_class = PrimeraEncuestaSerializer
    pagination_class = CustomPagination

    
    def get_queryset(self):
       primeraEncuestas = PrimeraEncuesta.objects.all()
       return primeraEncuestas

    # Get all primeraEncuestas
    def get(self, request, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED) 

    # Create a new primeraEncuesta
    def post(self, request):
        serializer = PrimeraEncuestaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class get_primeraEncuestasAdmin(ListCreateAPIView):
    serializer_class = PrimeraEncuestaSerializer
    pagination_class = CustomPagination
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    estudios = {
        '1' : 'Analisis Sanguineos',
        '2' : 'Analisis Clinicos',
        '3' : 'Ultrasonografia',
        '4' : 'Ultrasonografia Doppler',
        '5' : 'Rayos X',
        '6' : 'Rayos X Contrastado',
        '7' : 'Mastografia',
        '8' : 'Papanicolau',
        '9' : 'Cardiologia',
        '10' : 'Tomografia',
        '11' : 'Tomografia Contrastada',
        '12' : 'Resonancia Magnetica Contrastada',
        '13' : 'Colposcopia',
        '14' : 'Densitometria',
        '15' : 'Audiologia',
        '16' : 'Espirometria',
        '17' : 'Patologia',
        '18' : 'Consulta',
        '19' : 'Cardiologia',
        '20' : 'Rehabilitacion'
    }

    def get_queryset(self):
       primeraEncuestas = PrimeraEncuesta.objects.all()
       return primeraEncuestas

    # Obtener las encuestas
    def get(self, request, sucursal, estudio):
        if (request.user.profile.tipo =="Administrador"):  # If editors is who makes request
            filtros = {}
            print(sucursal, estudio)
            if estudio != 'all':
                print('ok')
                filtros['preguntaDos'] = self.estudios.get(estudio)
            if sucursal != 'all':
                filtros['Sucursal'] = sucursal
            print(filtros)
            # Contar los sí y no de las primera pregunta .values('preguntaUno', ).annotate(counter=Count('preguntaUno'))
            counterPrimeraPregunta = PrimeraEncuesta.objects.filter(**filtros).values('preguntaUno', ).annotate(counter=Count('preguntaUno'))
            counterSegundaPregunta = PrimeraEncuesta.objects.filter(**filtros).values('preguntaDos', ).annotate(counter=Count('preguntaDos'))
            counterTerceraPregunta = PrimeraEncuesta.objects.filter(**filtros).values('preguntaTres', ).annotate(counter=Count('preguntaTres'))
            print(counterTerceraPregunta)
            content = {
                'status': 'Good',
                'counterPrimeraPregunta' : counterPrimeraPregunta,
                'counterSegundaPregunta' : counterSegundaPregunta,
                'counterTerceraPregunta' : counterTerceraPregunta
            }
            return Response(content, status=status.HTTP_200_OK)
        else:
            content = {
                    'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new primeraEncuesta
    def post(self, request):
        serializer = PrimeraEncuestaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(Paciente=paciente)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class get_delete_update_historiaClinicaMedico(RetrieveUpdateDestroyAPIView):
    serializer_class = HistoriaClinicaSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            historiaClinica = HistoriaClinica.objects.get(pk=pk)
        except HistoriaClinica.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return historiaClinica


    # Get a historiaClinica
    def get(self, request, pk, *args, **kwargs):
        try:
            historiaClinica = HistoriaClinica.objects.get(pk=pk)
        except HistoriaClinica.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        historiaClinica = self.get_queryset(pk)
        if (request.user.profile.tipo =="Medico"): # If editors is who makes request
            serializer = HistoriaClinicaSerializer(historiaClinica)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a historiaClinica
    def put(self, request, pk, *args, **kwargs):
        try:
            historiaClinica = HistoriaClinica.objects.get(pk=pk)
        except HistoriaClinica.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        historiaClinica = self.get_queryset(pk)
        if (request.user.profile.tipo =="Medico"): # If editors is who makes request
            serializer = HistoriaClinicaSerializer(historiaClinica, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a historiaClinica
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_historiaClinicasMedico(ListCreateAPIView):
    serializer_class = HistoriaClinicaSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       historiaClinicas = HistoriaClinica.objects.all()
       return historiaClinicas


    # Get all historiaClinicas
    def get(self, request, *args, **kwargs):
        historiaClinicas = self.get_queryset()
        idPaciente = False
        idPaciente = self.request.GET.get("paciente")
        if (request.user.profile.tipo =="Medico"): # If editors is who makes request 
            if(idPaciente):
                historiaClinicas = historiaClinicas.filter(Paciente__id = idPaciente).order_by('-creacion')
                paginate_queryset = self.paginate_queryset(historiaClinicas)
                serializer = self.serializer_class(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
            else:
                content = {
                    'status': 'No puedes consultar todos los pacientes'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new historiaClinica
    def post(self, request):
        serializer = HistoriaClinicaSerializer(data=request.data)
        if (request.user.profile.tipo =="Medico"): # If editors is who makes request
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_historiaClinicaOp(RetrieveUpdateDestroyAPIView):
    serializer_class = HistoriaClinicaSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            historiaClinica = HistoriaClinica.objects.get(pk=pk)
        except HistoriaClinica.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return historiaClinica


    # Get a historiaClinica
    def get(self, request, pk, *args, **kwargs):
        try:
            historiaClinica = HistoriaClinica.objects.get(pk=pk)
        except HistoriaClinica.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        historiaClinica = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            serializer = HistoriaClinicaSerializer(historiaClinica)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a historiaClinica
    def put(self, request, pk, *args, **kwargs):
        try:
            historiaClinica = HistoriaClinica.objects.get(pk=pk)
        except HistoriaClinica.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        historiaClinica = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            serializer = HistoriaClinicaSerializer(historiaClinica, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a historiaClinica
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_historiaClinicasOp(ListCreateAPIView):
    serializer_class = HistoriaClinicaSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       historiaClinicas = HistoriaClinica.objects.all()
       return historiaClinicas

    # Get all historiaClinicas
    def get(self, request, *args, **kwargs):
        historiaClinicas = self.get_queryset()
        idPaciente = False
        idPaciente = self.request.GET.get("paciente")
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            if(idPaciente):
                historiaClinicas = historiaClinicas.filter(Paciente__id = idPaciente)
                paginate_queryset = self.paginate_queryset(historiaClinicas)
                serializer = self.serializer_class(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
            else:
                content = {
                    'status': 'No puedes consultar todos los pacientes'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new historiaClinica
    def post(self, request):
        serializer = HistoriaClinicaSerializer(data=request.data)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_delete_update_historiaClinica(RetrieveUpdateDestroyAPIView):
    serializer_class = HistoriaClinicaSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            historiaClinica = HistoriaClinica.objects.get(pk=pk)
        except HistoriaClinica.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return historiaClinica


    # Get a historiaClinica
    def get(self, request, pk, *args, **kwargs):
        try:
            historiaClinica = HistoriaClinica.objects.get(pk=pk)
        except HistoriaClinica.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        historiaClinica = self.get_queryset(pk)
        if (historiaClinica.Paciente.id==request.user.profile.id_sem):  # If editors is who makes request
            serializer = Serializer(historiaClinica)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)
			
			
    # Update a historiaClinica
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a historiaClinica
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_historiaClinicas(ListCreateAPIView):
    serializer_class = HistoriaClinicaSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       historiaClinicas = HistoriaClinica.objects.all()
       return historiaClinicas

    # Get all historiaClinicas
    def get(self, request, *args, **kwargs):
        historiaClinicas = self.get_queryset()
        historiaClinicas = historiaClinicas.filter(Paciente = request.user.profile.id_sem).order_by('-creacion')
        paginate_queryset = self.paginate_queryset(historiaClinicas)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)


    # Create a new historiaClinica
    def post(self, request):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_consultaMedico(RetrieveUpdateDestroyAPIView):
    serializer_class = ConsultaSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            consulta = Consulta.objects.get(pk=pk)
        except Consulta.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return consulta


    # Get a consulta
    def get(self, request, pk, *args, **kwargs):
        try:
            consulta = Consulta.objects.get(pk=pk)
        except Consulta.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        consulta = self.get_queryset(pk)
        if (request.user.profile.tipo =="Medico"): # If editors is who makes request
            serializer = ConsultaSerializer(consulta)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a consulta
    def put(self, request, pk, *args, **kwargs):
        try:
            consulta = Consulta.objects.get(pk=pk)
        except Consulta.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        consulta = self.get_queryset(pk)
        if (request.user.profile.tipo =="Medico"): # If editors is who makes request
            serializer = ConsultaSerializer(consulta, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a consulta
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_consultasMedico(ListCreateAPIView):
    serializer_class = ConsultaSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       consultas = Consulta.objects.all()
       return consultas

    # Get all consultas
    def get(self, request, *args, **kwargs):
        consultas = self.get_queryset()
        serializer_class = ConsultaMedicoAllSerializer
        idPaciente = False
        especialidad = False
        fecha = False
        idPaciente = self.request.GET.get("paciente")
        especialidad = self.request.GET.get("especialidad")
        fecha = self.request.GET.get("fecha")
        medico = self.request.GET.get("medico")
        if (request.user.profile.tipo =="Medico"): # If editors is who makes request
            if(idPaciente):
                consultas = consultas.filter(Paciente__id = idPaciente)
                if(especialidad):
                    print("especialidad")
                    if(not especialidad=='All'):
                        consultas = consultas.filter(especialidad = especialidad)
                print("fecha")
                if(fecha):
                    today = date.today()
                    if(fecha=='Year'):
                        print(today.year)
                        consultas = consultas.filter(creacion__year = today.year)
                    if(fecha=='Month'):
                        consultas = consultas.filter(creacion__month = today.month)
                if(medico):
                    consultas = consultas.filter(Medico__id = request.user.profile.id_sem)
                consultas = consultas.order_by('-creacion')
                paginate_queryset = self.paginate_queryset(consultas)
                serializer = ConsultaSerializer(consultas)
                serializer = ConsultaMedicoAllSerializer(paginate_queryset, many=True)
#                serializer = ConsultaMedicoAllSerializer(consultas)
                return self.get_paginated_response(serializer.data)
            else:
                content = {
                    'status': 'No puedes consultar todas las consultas'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new consulta
    def post(self, request):
        serializer = ConsultaSerializer(data=request.data)
        if (request.user.profile.tipo =="Medico"): # If editors is who makes request
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_consultaOp(RetrieveUpdateDestroyAPIView):
    serializer_class = ConsultaSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            consulta = Consulta.objects.get(pk=pk)
        except Consulta.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return consulta


    # Get a consulta
    def get(self, request, pk, *args, **kwargs):
        try:
            consulta = Consulta.objects.get(pk=pk)
        except Consulta.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        consulta = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            serializer = ConsultaSerializer(consulta)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a consulta
    def put(self, request, pk, *args, **kwargs):
        try:
            consulta = Consulta.objects.get(pk=pk)
        except Consulta.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        consulta = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            serializer = ConsultaSerializer(consulta, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a consulta
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_consultasOp(ListCreateAPIView):
    serializer_class = ConsultaSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       consultas = Consulta.objects.all()
       return consultas

    # Get all consultas
    def get(self, request, *args, **kwargs):
        consultas = self.get_queryset()
        idPaciente = False
        idPaciente = self.request.GET.get("paciente")
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            if(idPaciente):
                consultas = consultas.filter(Paciente__id = idPaciente)
                paginate_queryset = self.paginate_queryset(consultas)
                serializer = self.serializer_class(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
            else:
                content = {
                    'status': 'No puedes consultar todas las consultas'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new consulta
    def post(self, request):
        serializer = ConsultaSerializer(data=request.data)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_delete_update_consulta(RetrieveUpdateDestroyAPIView):
    serializer_class = ConsultaSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            consulta = Consulta.objects.get(pk=pk)
        except Consulta.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return consulta


    # Get a consulta
    def get(self, request, pk, *args, **kwargs):
        try:
            consulta = Consulta.objects.get(pk=pk)
        except Consulta.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        consulta = self.get_queryset(pk)
        if (consulta.Paciente.id==request.user.profile.id_sem):  # If editors is who makes request
            serializer = ConsultaSerializer(consulta)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)
			
			
    # Update a consulta
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a consulta
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_consultas(ListCreateAPIView):
    serializer_class = ConsultaSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       consultas = Consulta.objects.all()
       return consultas

    # Get all consultas
    def get(self, request, *args, **kwargs):
        consultas = self.get_queryset()
        especialidad = False
        fecha = False
        especialidad = self.request.GET.get("especialidad")
        fecha = self.request.GET.get("fecha")
        consultas = consultas.filter(Paciente = request.user.profile.id_sem)


        if(especialidad):
            print("especialidad")
            if(not especialidad=='All'):
                consultas = consultas.filter(especialidad = especialidad)
            print("fecha")
            if(fecha):
                today = date.today()
                if(fecha=='Year'):
                    print(today.year)
                    consultas = consultas.filter(creacion__year = today.year)
                if(fecha=='Month'):
                    consultas = consultas.filter(creacion__month = today.month)
        paginate_queryset = self.paginate_queryset(consultas)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)
		
    # Create a new consulta
    def post(self, request):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)



class get_delete_update_medico(RetrieveUpdateDestroyAPIView):
    serializer_class = MedicoSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            medico = Medico.objects.get(pk=pk)
        except Medico.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return medico

    # Get a medico
    def get(self, request, pk, *args, **kwargs):
        try:
            medico = Medico.objects.get(pk=pk)
        except Medico.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        medico = self.get_queryset(pk)
        if (request.user.profile.tipo =="Medico"):  # If editors is who makes request
            serializer = MedicoSerializer(medico)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                    'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a medico
    def put(self, request, pk, *args, **kwargs):
        print("entra")
        try:
            medico = Medico.objects.get(pk=pk)
        except Medico.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        medico = self.get_queryset(pk)
        if(request.user.profile.tipo =="Medico"): 
            if(medico.id==request.user.profile.id_sem):  # If editors is who makes request
                serializer = MedicoSerializer(medico, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                content = {
                    'status': 'UNAUTHORIZED'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a medico
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_medicos(ListCreateAPIView):
    serializer_class = MedicoSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       medicos = Medico.objects.all()
       return medicos

    # Get all medicos
    def get(self, request, *args, **kwargs):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new Medico
    def post(self, request):
        serializer = MedicoSerializer(data=request.data)
        tablaPermisos = TablaPermisos.objects.all()
        if serializer.is_valid():
            serializer.save(estrellas=5,ranking=500,verificado='PENDIENTE',hora_apertura = '07:00:00' ,hora_cierre = '18:00:00' ,hora_apertura_sab = '09:00:00' ,hora_cierre_sab = '18:00:00' ,hora_apertura_dom ='00:00:00' ,hora_cierre_dom = '00:00:01')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class get_delete_update_admin(RetrieveUpdateDestroyAPIView):
    serializer_class = AdminSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            admin = Admin.objects.get(pk=pk)
        except Admin.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return admin

    # Get a admin
    def get(self, request, pk, *args, **kwargs):
        try:
            admin = Admin.objects.get(pk=pk)
        except Admin.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        admin = self.get_queryset(pk)
        if (request.user.profile.tipo =="Administrador"):  # If editors is who makes request
            serializer = AdminSerializer(admin)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                    'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a admin
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a admin
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_admins(ListCreateAPIView):
    serializer_class = AdminSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       admins = Admin.objects.all()
       return admins

    # Get all admins
    def get(self, request, *args, **kwargs):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new Admin
    def post(self, request):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_citaMedico(RetrieveUpdateDestroyAPIView):
    serializer_class = CitaMedicoSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)
  
    def get_queryset(self, pk):
        try:
            citaMedico = CitaMedico.objects.get(pk=pk)
        except CitaMedico.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return citaMedico

    # Get a citaMedico
    def get(self, request, pk, *args, **kwargs):
        try:
            citaMedico = CitaMedico.objects.get(pk=pk)
        except CitaMedico.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        citaMedico = self.get_queryset(pk)
        if (request.user.profile.tipo =="Medico"):  # If Medico owner is who makes request
            idMedico = request.user.profile.id_sem
            medicos = Medico.objects.all()
            medicos = medicos.filter(id = idMedico)
            if(idMedico == citaMedico.Medico.id):

                serializer = CitaMedicoSerializer(citaMedico)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                content = {
                    'status': 'UNAUTHORIZED'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a citaMedico
    def put(self, request, pk, *args, **kwargs):
        try:
            citaMedico = CitaMedico.objects.get(pk=pk)
        except citaMedico.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        print("entras")
        citaMedico = self.get_queryset(pk)
        if (request.user.profile.tipo =="Medico"):  # If Medico owner is who makes request
            idMedico = request.user.profile.id_sem
            medicos = Medico.objects.all()
            medicos = medicos.filter(id = idMedico)
            if(idMedico == citaMedico.Medico.id):
                serializer = CitaMedicoSerializer(citaMedico, data=request.data)
                serializerR = CitaMedicoSerializer(data=request.data)
                if(serializerR.is_valid()):
                    if((serializerR.data['hora_final'])or(serializerR.data['hora_inicio'])or(serializerR.data['fecha_cita'])):
                        if((serializerR.data['hora_final'])and(serializerR.data['hora_inicio'])and(serializerR.data['fecha_cita'])):
                            horaFinal=datetime.strptime(serializerR.data['hora_final'], '%H:%M:%S').time()
                            horaInicio=datetime.strptime(serializerR.data['hora_inicio'], '%H:%M:%S').time()
                            fechaCita=serializerR.data['fecha_cita']
                            citas = citas.objects.all()
                            citas = citas.filter(Medico__id = request.user.profile.id_sem)
                            citas = citas.filter(Sucursal__id = sucursalCita) #change
                            citas = citas.filter(fecha_cita = fechaCita)
                            medico = Medico.objects.all()
                            medico = Medico.filter(id=request.user.profile.id_sem)
                            hora_apertura = medico[0].hora_apertura
                            hora_cierre = medico[0].hora_cierre
                            hora_apertura_sab = medico[0].hora_apertura_sab
                            hora_cierre_sab = medico[0].hora_cierre_sab
                            hora_apertura_dom = medico[0].hora_apertura_dom
                            hora_cierre_dom = medico[0].hora_cierre_dom
                            flag=0 #Horario cierre
                            flag2=1 #Comparador de citas
                            flag3=0 # Horainicio vs HoraFinal
                            i=0
                            msgStatus="Error"
                            if(horaInicio>horaFinal):
                                msgStatus = "Error en la estrucutra de la cita"
                                flag3=1
                            while(i<len(citas)):
                                if(citas[i].estatus=="ACTIVA"):
                                    if((citas[i].hora_inicio <= horaInicio <= citas[i].hora_final)or(citas[i].hora_inicio <= horaFinal <= citas[i].hora_final)):
                                        if(citas[i].id == citaMedico.id):
                                            print("msima cita")
                                        else:
                                            if((citas[i].estatus=="CERRADA") or (citas[i].estatus=="CANCELADA")):
                                                print("no procede")
                                            else:
                                                print("error")
                                                flag=1
                                                msgStatus = "El horario de esta cita coincide con otra previamente ingresada"
                                i=i+1
                            if((hora_apertura <=  horaInicio <= hora_cierre)and(hora_apertura <= horaFinal <= hora_cierre)):
                                flag2=0
                            if((hora_apertura_sab <=  horaInicio <= hora_cierre_sab)and(hora_apertura_sab <= horaFinal <= hora_cierre_sab)):
                                flag2=0
                            if((hora_apertura_dom <=  horaInicio <= hora_cierre_dom)and(hora_apertura_dom <= horaFinal <= hora_cierre_dom)):
                                flag2=0
                            if(flag2):
                                msgStatus = "Esta cita no coincide con los horarios permitidos"
                            if (flag or flag2 or flag3):
                                if serializer.is_valid():
                                    content = {
                                        'status': msgStatus
                                    }
                                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                            else:
                                if serializer.is_valid():
                                    serializer.save()
                                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                        else:
                            content = {
                                'status': 'Faltan Campos'
                            }
                            return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                    else:
                        print("no reagendar")
                        if serializer.is_valid():
                            serializer.save()
                            print("save")
                            return Response(serializer.data, status=status.HTTP_201_CREATED)
                        else:
                            content = {
                                'status': 'Error de estrucutra'
                            }
                            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

                else:
                    content = {
                        'status': 'Error de estrucutra'
                    }
                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)
            else:
                content = {
                    'status': 'Usuario no autorizado'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'Usuario no autorizado'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a citaMedico
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_citaMedicos(ListCreateAPIView):
    serializer_class = CitaMedicoSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
        citaMedicos = CitaMedico.objects.all()
        return citaMedicos

    # Get all citaMedicos
    def get(self, request, *args, **kwargs):
        if (request.user.profile.tipo =="Medico"):  # If Medico is who makes request
            citaMedicos = self.get_queryset()
            idMedico = request.user.profile.id_sem
            medicos = Medico.objects.all()
            medicos = medicos.filter(id = idMedico)
            citaMedicos = citaMedicos.filter(Medico__id = idMedico)
            paginate_queryset = self.paginate_queryset(citaMedicos)
            serializer = CitaMedicoPacienteSerializer(paginate_queryset, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            print("Usuario no autorizado")
            content = {
                'status': 'Usuario no autorizado'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


# Create a new citaMedico
def post(self, request):
        serializer = CitaMedicoSerializer(data=request.data)
        serializerR = CitaMedicoSerializer(data=request.data)
        if(serializerR.is_valid()):
            if (request.user.profile.tipo =="Medico"):  # If Medico is who makes request
                if((serializerR.data['hora_final'])and(serializerR.data['hora_inicio'])and(serializerR.data['fecha_cita'])and(serializerR.data['tipo'])and(serializerR.data['estatus'])):
                    MedicoCita=serializerR.data['Medico']
                    horaFinal=datetime.strptime(serializerR.data['hora_final'], '%H:%M:%S').time()
                    horaInicio=datetime.strptime(serializerR.data['hora_inicio'], '%H:%M:%S').time()
                    fechaCita=serializerR.data['fecha_cita']
                    citas = CitaMedico.objects.all()
                    citas = citas.filter(Medico__id = request.user.profile.id_sem)
                    citas = citas.filter(Sucursal__id = sucursalCita) #change
                    citas = citas.filter(fecha_cita = fechaCita)
                    medico = Medico.objects.all()
                    medico = medico.filter(id=request.user.profile.id_sem)
                    hora_apertura = medico[0].hora_apertura
                    hora_cierre = medico[0].hora_cierre
                    hora_apertura_sab = medico[0].hora_apertura_sab
                    hora_cierre_sab = medico[0].hora_cierre_sab
                    hora_apertura_dom = medico[0].hora_apertura_dom
                    hora_cierre_dom = medico[0].hora_cierre_dom
                    flag=0 #Horario cierre
                    flag2=1 #Comparador de citas
                    flag3=0 # Horainicio vs HoraFinal
                    i=0
                    msgStatus="Error"
                    if(horaInicio>horaFinal):
                        msgStatus = "Error en la estrucutra de la cita"
                        flag3=1
                    while(i<len(citas)):
                        if(citas[i].estatus=="ACTIVA"):
                            if((citas[i].hora_inicio <= horaInicio <= citas[i].hora_final)or(citas[i].hora_inicio <= horaFinal <= citas[i].hora_final)):
                                if((citas[i].estatus=="CERRADA") or (citas[i].estatus=="CANCELADA")):
                                    print("no procede")
                                else:
                                    print("error")
                                    flag=1
                                    msgStatus = "El horario de esta cita coincide con otra previamente ingresada"
                        i=i+1
                    if((hora_apertura <=  horaInicio <= hora_cierre)and(hora_apertura <= horaFinal <= hora_cierre)):
                        flag2=0
                    if((hora_apertura_sab <=  horaInicio <= hora_cierre_sab)and(hora_apertura_sab <= horaFinal <= hora_cierre_sab)):
                        flag2=0
                    if((hora_apertura_dom <=  horaInicio <= hora_cierre_dom)and(hora_apertura_dom <= horaFinal <= hora_cierre_dom)):
                        flag2=0
                    if(flag2):
                        msgStatus = "Esta cita no coincide con los horarios permitidos"
                    if (flag or flag2 or flag3):
                        if serializer.is_valid():
                            content = {
                                'status': msgStatus
                            }
                            return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        if serializer.is_valid():
                            serializer.save()

                            return Response(serializer.data, status=status.HTTP_201_CREATED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    content = {
                        'status': 'Faltan Campos'
                    }
                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)
            else:
                content = {
                    'status': 'Usuario no permitido'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'Error de estrucutra'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_tokenZooms(ListCreateAPIView):
    
    # Get all tokenZooms
    def get(self, request, *args, **kwargs):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new TokenZoom
    def post(self, request):
        print("entra")
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)



class get_delete_update_medicoGen(RetrieveUpdateDestroyAPIView):
    serializer_class = MedicoSerializer

    def get_queryset(self, pk):
        try:
            medico = Medico.objects.get(pk=pk)
        except Medico.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return medico

    # Get a medico
    def get(self, request, pk, *args, **kwargs):
        try:
            medico = Medico.objects.get(pk=pk)
        except Medico.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        medico = self.get_queryset(pk)
        if(medico.verificado == "APROVADO"): 
            serializer = MedicoSerializer(medico)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'Medico Pendiente de aprovacion'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

        

    # Update a medico
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a medico
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_medicosGen(ListCreateAPIView):
    serializer_class = MedicoSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       medicos = Medico.objects.all()
       return medicos

    # Get all medicos
    def get(self, request, *args, **kwargs):        
        medicos = self.get_queryset()
        medicos = medicos.filter(verificado = "APROBADO") 
        paginate_queryset = self.paginate_queryset(medicos)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)


    # Create a new Medico
    def post(self, request):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)



class get_delete_update_citaMedicoPac(RetrieveUpdateDestroyAPIView):
    serializer_class = CitaMedicoSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self):
        citaMedicos = CitaMedico.objects.all()
        return citaMedicos
  
    # Get a citaMedico
    def get(self, request, pk, *args, **kwargs):
        try:
            citaMedico = CitaMedico.objects.get(pk=pk)
        except CitaMedico.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        citaMedico = self.get_queryset(pk)
        if (request.user.profile.tipo =="Paciente"):  # If Medico owner is who makes request
            if(citaMedico.Paciente.id == request.user.profile.id_sem):  # If editors is who makes request
                serializer = CitaMedicoSerializer(citaMedico)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                content = {
                    'status': 'UNAUTHORIZED'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a citaMedico
    def put(self, request, pk, *args, **kwargs):
        try:
            citaMedico = CitaMedico.objects.get(pk=pk)
        except citaMedico.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        citaMedico = self.get_queryset(pk)
        if (request.user.profile.tipo =="Paciente"):  # If Medico owner is who makes request
            if(citaMedico.Paciente.id == request.user.profile.id_sem):  # If editors is who makes request
                serializer = CitaMedicoSerializer(citaMedico, data=request.data)
                serializerR = CitaMedicoSerializer(data=request.data)
                if(serializerR.is_valid()):
                    if(not((serializerR.data['Medico'])or(serializerR.data['Paciente']))):
                        if((serializerR.data['estatus'])):
                            if serializer.is_valid():
                                serializer.save()
                                return Response(serializer.data, status=status.HTTP_201_CREATED)
                            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)	
                        else:
                            content = {
                                'status': 'No permitido'
                            }
                            return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                    else:
                        content = {
                            'status': 'No permitido'
                        }
                        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                else:
                    content = {
                        'status': 'No permitido'
                    }
                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)
            else:
                content = {
                    'status': 'Usuario no autorizado'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'Usuario no autorizado'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a citaMedico
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_citaMedicosPac(ListCreateAPIView):
    serializer_class = CitaMedicoSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
        citaMedicos = CitaMedico.objects.all()
        return citaMedicos

    # Get all citaMedicos
    def get(self, request, *args, **kwargs):
        print("entra")
        if (request.user.profile.tipo =="Paciente"):  # If Medico owner is who makes request
            citaMedicos = self.get_queryset()
            citaMedicos = citaMedicos.filter(Paciente__id = request.user.profile.id_sem)
            paginate_queryset = self.paginate_queryset(citaMedicos)
            serializer = CitaMedicoAllSerializer(paginate_queryset, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            print("Usuario no autorizado")
            content = {
                'status': 'Usuario no autorizado'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new citaMedico
    def post(self, request):
        serializer = CitaMedicoSerializer(data=request.data)
        serializerR = CitaMedicoSerializer(data=request.data)
        if(serializerR.is_valid()):
            if (request.user.profile.tipo =="Paciente"):  # If Paciente owner is who makes request
                if((serializerR.data['hora_final'])and(serializerR.data['hora_inicio'])and(serializerR.data['fecha_cita'])and(serializerR.data['Paciente'])and(serializerR.data['Medico'])):
                    MedicoCita=serializerR.data['Medico']
                    horaFinal=datetime.strptime(serializerR.data['hora_final'], '%H:%M:%S').time()
                    horaInicio=datetime.strptime(serializerR.data['hora_inicio'], '%H:%M:%S').time()
                    fechaCita=serializerR.data['fecha_cita']
                    citas = CitaMedico.objects.all()
                    citas = citas.filter(Medico__id = request.user.profile.id_sem)
                    citas = citas.filter(Sucursal__id = sucursalCita) #change
                    citas = citas.filter(fecha_cita = fechaCita)
                    medico = Medico.objects.all()
                    medico = medico.filter(id=MedicoCita)
                    hora_apertura = medico[0].hora_apertura
                    hora_cierre = medico[0].hora_cierre
                    hora_apertura_sab = medico[0].hora_apertura_sab
                    hora_cierre_sab = medico[0].hora_cierre_sab
                    hora_apertura_dom = medico[0].hora_apertura_dom
                    hora_cierre_dom = medico[0].hora_cierre_dom
                    flag=0 #Horario cierre
                    flag2=1 #Comparador de citas
                    flag3=0 # Horainicio vs HoraFinal
                    i=0
                    msgStatus="Error"
                    if(horaInicio>horaFinal):
                        msgStatus = "Error en la estrucutra de la cita"
                        flag3=1
                    while(i<len(citas)):
                        if(citas[i].estatus=="ACTIVA"):
                            if((citas[i].hora_inicio <= horaInicio <= citas[i].hora_final)or(citas[i].hora_inicio <= horaFinal <= citas[i].hora_final)):
                                if((citas[i].estatus=="CERRADA") or (citas[i].estatus=="CANCELADA")):
                                    print("no procede")
                                else:
                                    print("error")
                                    flag=1
                                    msgStatus = "El horario de esta cita coincide con otra previamente ingresada"
                        i=i+1
                    print("bucle")
                    if((hora_apertura <=  horaInicio <= hora_cierre)and(hora_apertura <= horaFinal <= hora_cierre)):
                        flag2=0
                    if((hora_apertura_sab <=  horaInicio <= hora_cierre_sab)and(hora_apertura_sab <= horaFinal <= hora_cierre_sab)):
                        flag2=0
                    if((hora_apertura_dom <=  horaInicio <= hora_cierre_dom)and(hora_apertura_dom <= horaFinal <= hora_cierre_dom)):
                        flag2=0
                    if(flag2):
                        msgStatus = "Esta cita no coincide con los horarios permitidos"
                    if (flag or flag2 or flag3):
                        if serializer.is_valid():
                            content = {
                                'status': msgStatus
                            }
                            return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        if serializer.is_valid():
                            serializer.save(tipo="VIRTUAL", titulo="CITA ONLINE",estatus="ACTIVA")
                            return Response(serializer.data, status=status.HTTP_201_CREATED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    content = {
                        'status': 'Faltan Campos'
                    }
                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)
            else:
                content = {
                    'status': 'Usuario no permitido'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'Error de estrucutra'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_pacienteMedico(RetrieveUpdateDestroyAPIView):
    serializer_class = PacienteSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            paciente = Paciente.objects.get(pk=pk)
        except Paciente.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return paciente

    # Get a paciente Medico
    def get(self, request, pk, *args, **kwargs):
        try:
            paciente = Paciente.objects.get(pk=pk)
        except Paciente.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        paciente = self.get_queryset(pk)
        if (request.user.profile.tipo =="Medico"):  # If editors is who makes request
            serializer = PacienteSerializer(paciente)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                    'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a paciente Medico
    def put(self, request, pk, *args, **kwargs):
        try:
            paciente = Paciente.objects.get(pk=pk)
        except Paciente.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        paciente = self.get_queryset(pk)
        if (request.user.profile.tipo =="Medico"):  # If editors is who makes request
            serializer = PacienteSerializer(paciente, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a paciente Medico
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_pacientesMedico(ListCreateAPIView):
    serializer_class = PacienteSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       pacientes = Paciente.objects.all()
       return pacientes

    # Get all pacientes Medico
    def get(self, request, *args, **kwargs):
        queryBuscador = False
        queryBuscador = self.request.GET.get("queryBuscador")
        if (request.user.profile.tipo =="Medico"):  # If editors is who makes request
            if(queryBuscador):
                pacientes = Paciente.objects.all()
                pacientes = pacientes.filter(Q(nombre__icontains=queryBuscador) | Q(apellido_paterno__icontains=queryBuscador) | Q(apellido_materno__icontains=queryBuscador)).distinct()
                paginate_queryset = self.paginate_queryset(pacientes)
                serializer = self.serializer_class(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
            else:
                pacientes = self.get_queryset()
                paginate_queryset = self.paginate_queryset(pacientes)
                serializer = self.serializer_class(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new Paciente Medico
    def post(self, request):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_pagoOpenPay(RetrieveUpdateDestroyAPIView):
    serializer_class = PagoOpenPaySerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            pagoOpenPay = PagoOpenPay.objects.get(pk=pk)
        except PagoOpenPay.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return pagoOpenPay

    # Get a pagoOpenPay
    def get(self, request, pk, *args, **kwargs):
        try:
            pagoOpenPay = PagoOpenPay.objects.get(pk=pk)
        except PagoOpenPay.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        pagoOpenPay = self.get_queryset(pk)
        if (pagoOpenPay.Paciente.id==request.user.profile.id_sem):  # If editors is who makes request
            serializer = PagoOpenPaySerializer(pagoOpenPay)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Update a pagoOpenPay
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }

        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Delete a pagoOpenPay
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_post_pagoOpenPays(ListCreateAPIView):
    parser_class = (FileUploadParser,)
    serializer_class = PagoOpenPaySerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       pagoOpenPays = PagoOpenPay.objects.all()
       return pagoOpenPays

    # Get all pagoOpenPays
    def get(self, request, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new pagoOpenPay
    def post(self, request):
        if (pagoOpenPay.Paciente.id==request.user.profile.id_sem):  # If editors is who makes request
            serializer = PagoOpenPaySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)



class get_delete_update_estudioMedico(RetrieveUpdateDestroyAPIView):
    serializer_class = EstudioSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            estudio = Estudio.objects.get(pk=pk)
        except Estudio.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return estudio


    # Get a estudio
    def get(self, request, pk, *args, **kwargs):
        try:
            estudio = Estudio.objects.get(pk=pk)
        except Estudio.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        estudio = self.get_queryset(pk)
        if (request.user.profile.tipo =="Medico"): # If editors is who makes request
            serializer = EstudioSerializer(estudio)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a estudio
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a estudio
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_estudiosMedico(ListCreateAPIView):
    serializer_class = EstudioSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       estudios = Estudio.objects.all()
       return estudios

    # Get all estudios
    def get(self, request, *args, **kwargs):
        estudios = self.get_queryset()
        idPaciente = False
        idPaciente = self.request.GET.get("paciente")
        if (request.user.profile.tipo =="Medico"): # If editors is who makes request
            if(idPaciente):
                estudios = estudios.filter(Paciente__id = idPaciente)
                paginate_queryset = self.paginate_queryset(estudios)
                serializer = self.serializer_class(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
            else:
                content = {
                    'status': 'No puedes consultar todos los pacientes'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new estudio
    def post(self, request):
        serializer = EstudioSerializer(data=request.data)
        serializerR = EstudioSerializer(data=request.data)
        if (request.user.profile.tipo =="Medico"): # If editors is who makes request
            if serializer.is_valid():
                serializer.save()
                if(serializerR.is_valid()): 
                    idPaciente = serializerR.data['Paciente']
                    paciente = Paciente.objects.get(id=idPaciente)
                    print(paciente.email)
                    send_mail('Su estudio se encuentra listo','Puede consultar su resultados desde nuestra plataforma en linea www.semin.mx. Agradecemos su confianza.','info@semin.mx',[paciente.email],fail_silently=False,)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

# Stripe payment
class get_post_update_stripeCharge(ListCreateAPIView):
    
    def get_queryset(self):
       citas = CitaSucursal.objects.all()
       return citas

    # Create a new Stripe Payment
    def post(self, request):
        # Get secret key from the env
        stripe.api_key = settings.STRIPE_SECRET_KEY_PRODUCTION
        # Load data from request body
        data = json.loads(request.body)


        
        app_m = False ;
        try:
            if(data.app_movil == undefined or data.app_movil == null ):
                app_m = False;
            else:
                app_m = True;
        except: 
            app_m = False;

        

        if(data.get('token')):
            try: 
                # Create request to stripe to charge
                charge = stripe.Charge.create(
                    amount = data.get('amount'),
                    currency = 'MXN',
                    source = data.get('token')
                )
                # The charge was correct
                if charge:
                    id_payment = charge.id
                    print(f"Payment id {id_payment}")
                    # Get shopping card items
                    ids_array=data.get("order_id")
                    # Add the payment to the items in the shoping car               
                    for element in ids_array:
                        print ("id_",element['item'])
                        id_appointment= int(element['item'])
                        """ Update values CARRITO to ACTIVA"""
                        cita = CitaSucursal.objects.get(pk=id_appointment)
                        cita.estatus="ACTIVA"
                        cita.tipo_pago="STRIPE"
                        cita.app_movil=app_m
                        cita.id_pago=str(id_payment)
                        cita.save()
                    
                    return Response(charge, status=status.HTTP_200_OK)
            except stripe.error.CardError as e:
                # Since it's a decline, stripe.error.CardError will be caught
                print('Status is: %s' % e.http_status)
                print('Type is: %s' % e.error.type)
                print('Code is: %s' % e.error.code)
                # param is '' in this case
                print('Param is: %s' % e.error.param)
                print('Message is: %s' % e.error.message)
                error_description = f"Error en tarjeta {e.http_status} {e.error.type} {e.error.code} {e.error.param} {e.error.message}"
                pass
            except stripe.error.RateLimitError as e:
                # Too many requests made to the API too quickly
                print(e)
                error_description = 'Demasiadas peticiones a Stripe'
                pass
            except stripe.error.InvalidRequestError as e:
                # Invalid parameters were supplied to Stripe's API
                print(e)
                error_description = 'Datos invalidos'
                pass
            except stripe.error.AuthenticationError as e:
                # Authentication with Stripe's API failed
                # (maybe you changed API keys recently)
                print(e)
                error_description = 'Error con el token'
                pass
            except stripe.error.APIConnectionError as e:
                # Network communication with Stripe failed
                print(e)
                error_description = 'Error de Red'
                pass
            except stripe.error.StripeError as e:
                # Display a very generic error to the user, and maybe send
                # yourself an email
                print(e)
                error_description = 'Error en Stripe'
                pass
            except Exception as e:
                # Something else happened, completely unrelated to Stripe
                print(e)
                error_description = 'Error desconocido'
            
            # Return data with description of the error
            content = {'status': '402',
                        'description': error_description
                    }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'Missing token'
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)


#Paypal payment
class get_post_update_paypalCharge(ListCreateAPIView):
    
    def get_queryset(self):
       citas = CitaSucursal.objects.all()
       return citas

    # Save payment information in DB
    def post(self, request):
        # Check for the paymend_id
        if(request.POST.get('payment_id')):
            id_payment = request.POST.get('payment_id')
            # Get shopping card items
            ids_array=json.loads(request.POST.get("order_id"))
            # Add the payment to the items in the shoping car               
            for element in ids_array:
                print ("id_",element['item'])
                id_appointment= int(element['item'])
                """ Update values CARRITO to ACTIVA"""
                cita = CitaSucursal.objects.get(pk=id_appointment)
                cita.estatus="ACTIVA"
                cita.tipo_pago="PAYPAL"
                cita.id_pago=str(id_payment)
                cita.save()
            
            content = {
                'status': 'OK'
            }
            return Response(content, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'Missing payment_id'
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)


class get_delete_update_tablaPermisosPac(RetrieveUpdateDestroyAPIView):
    serializer_class = TablaPermisosSerializer

    def get_queryset(self, pk):
        try:
            tablaPermisos = TablaPermisos.objects.get(pk=pk)
        except TablaPermisos.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return tablaPermisos

    # Get a tablaPermisos
    def get(self, request, pk, *args, **kwargs):
        try:
            tablaPermisos = TablaPermisos.objects.get(pk=pk)
        except TablaPermisos.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        tablaPermisos = self.get_queryset(pk)
        if (request.user.profile.tipo =="Paciente"):  # If editors is who makes request
            if (request.user.profile.id_sem == tablaPermisos.Paciente__id):  # If editors is who makes request
                fecha = date.today()
                if(tablaPermisos.caducidad < fecha):
                    if(tablaPermisos.estatus == "ACTIVA"):
                        serializer = TablaPermisosSerializer(tablaPermisos)
                        return Response(serializer.data, status=status.HTTP_200_OK)
                    else:
                        content = {
                            'status': 'Usuario no autorizado'
                        }
                        return Response(content, status=status.HTTP_401_UNAUTHORIZED)	
                else:
                    content = {
                        'status': 'Usuario no autorizado'
                    }
                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)	
            else:
                content = {
                    'status': 'Usuario no autorizado'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'Tipo de usuario no autorizado'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a tablaPermisos
    def put(self, request, pk, *args, **kwargs):
        try:
            tablaPermisos = TablaPermisos.objects.get(pk=pk)
        except TablaPermisos.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        tablaPermisos = self.get_queryset(pk)
        if (request.user.profile.id_sem == tablaPermisos.Paciente.id): # If editors is who makes request
            serializer = TablaPermisosSerializer(tablaPermisos, data=request.data)		
            serializerR = TablaPermisosSerializer(tablaPermisos, data=request.data)
            if(serializerR.is_valid()):
                if(not(serializerR.data['token'])or(serializerR.data['caducidad'])or(serializerR.data['email'])or(serializerR.data['tipo'])or(serializerR.data['Medico'])or(serializerR.data['Paciente'])or(serializerR.data['creador'])or(serializerR.data['editor'])):
                    if serializer.is_valid():
                        serializer.save()
                    else:
                        content = {
                            'status': 'No valido'
                        }
                        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                else:
                    content = {
                        'status': 'No valido'
                    }
                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a tablaPermisos
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_tablaPermisosPac(ListCreateAPIView):
    serializer_class = TablaPermisosMedSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
       tablaPermisos = TablaPermisos.objects.all()
       return tablaPermisos

    # Get all tablaPermisos
    def get(self, request, *args, **kwargs):
        print("entras")
        tablaPermisos = self.get_queryset()
        fecha = date.today()
        tablaPermisos = tablaPermisos.filter(Paciente__id = request.user.profile.id_sem)
        tablaPermisos = tablaPermisos.filter(caducidad__gt = fecha)
        tablaPermisos = tablaPermisos.filter(estatus = "ACTIVO")
        paginate_queryset = self.paginate_queryset(tablaPermisos)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)


    # Create a new tablaPermisos
    def post(self, request):
        if (request.user.profile.tipo =="Paciente"):  # If editors is who makes request
            serializer = TablaPermisosSerializer(data=request.data)
            serializerR = TablaPermisosSerializer(data=request.data)
            if serializerR.is_valid():
                medico = serializerR.data['Medico']
                paciente = serializerR.data['Paciente']
                email = serializerR.data['email']
                tipo = serializerR.data['tipo'] 
                caducidad = serializerR.data['caducidad'] 
                tablaPermisos = TablaPermisos.objects.all()
                if(tipo  == "EXTERNO"):
                    tablaPermisos = tablaPermisos.filter(Paciente__id = paciente)
                    tablaPermisos = tablaPermisos.filter(email = email)
                    if(not len(tablaPermisos)==0):
                        #coincidencia externa
                        if serializer.is_valid():
                            tablaPermiso = TablaPermisos.objects.get(pk=tablaPermisos[0].id)
                            tablaPermiso.caducidad = caducidad
                            tablaPermiso.save()
                            return Response(serializer.data, status=status.HTTP_201_CREATED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
                    else:
                        if serializer.is_valid():
                            serializer.save(estatus = "ACTIVO")
                            return Response(serializer.data, status=status.HTTP_201_CREATED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                if(tipo  == "INTERNO"):
                    tablaPermisos = tablaPermisos.filter(Paciente__id = paciente)
                    tablaPermisos = tablaPermisos.filter(Medico__id = medico)
                    if(not len(tablaPermisos)==0):
                        # coincidencia interna
                        if serializer.is_valid():
                            tablaPermiso = TablaPermisos.objects.get(pk=tablaPermisos[0].id)
                            tablaPermiso.caducidad = caducidad
                            tablaPermiso.save()
                            return Response(serializer.data, status=status.HTTP_201_CREATED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        if serializer.is_valid():
                            serializer.save(estatus = "ACTIVO")
                            return Response(serializer.data, status=status.HTTP_201_CREATED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'Tipo de usuario no autorizado'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_tablaPermisosOp(RetrieveUpdateDestroyAPIView):
    serializer_class = TablaPermisosSerializer

    def get_queryset(self, pk):
        try:
            tablaPermisos = TablaPermisos.objects.get(pk=pk)
        except TablaPermisos.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return tablaPermisos

    # Get a tablaPermisos
    def get(self, request, pk, *args, **kwargs):
        try:
            tablaPermisos = TablaPermisos.objects.get(pk=pk)
        except TablaPermisos.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        tablaPermisos = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"):  # If editors is who makes request
            fecha = date.today()
            serializer = TablaPermisosSerializer(tablaPermisos)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'Tipo de usuario no autorizado'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a tablaPermisos
    def put(self, request, pk, *args, **kwargs):
        try:
            tablaPermisos = TablaPermisos.objects.get(pk=pk)
        except TablaPermisos.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        tablaPermisos = self.get_queryset(pk)
        serializer = TablaPermisosSerializer(tablaPermisos, data=request.data)		
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    # Delete a tablaPermisos
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_estudioEmpresas(ListCreateAPIView):
    parser_class = (FileUploadParser,)
    serializer_class = EstudioEmpresaSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
       estudioEmpresas = EstudioEmpresa.objects.all()
       return estudioEmpresas

    # Get all estudioEmpresas
    def get(self, request, *args, **kwargs):
        estudioEmpresas = self.get_queryset()
        solicitud = False
        solicitud = self.request.GET.get("solicitud")
        user = False
        user = self.request.GET.get("user")
        password = False
        password = self.request.GET.get("password")
        print(user)
        print(password)
        print(solicitud)
        estudioEmpresas = estudioEmpresas.filter(solicitud = solicitud)
        estudioEmpresas = estudioEmpresas.filter(usuario = user)
        estudioEmpresas = estudioEmpresas.filter(password = password)
        paginate_queryset = self.paginate_queryset(estudioEmpresas)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)

    # Create a new estudioEmpresa
    def post(self, request):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_tablaPermisosOp(ListCreateAPIView):
    serializer_class = TablaPermisosMedSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
       tablaPermisos = TablaPermisos.objects.all()
       return tablaPermisos

     # Get all tablaPermisos
    def get(self, request, *args, **kwargs):
        tablaPermisos = self.get_queryset()
        id = False
        id = self.request.GET.get("id")
        tipo = False
        tipo = self.request.GET.get("tipo")
        print(id)
        print(tipo)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            if(tipo == "Paciente" and id):
                tablaPermisos = tablaPermisos.filter(Paciente__id = id)
                tablaPermisos = tablaPermisos.filter(estatus = "ACTIVO")
                paginate_queryset = self.paginate_queryset(tablaPermisos)
                serializer = self.serializer_class(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
            else:
                if(tipo == "Medico" and id):
                    tablaPermisos = tablaPermisos.filter(Medico = id)
                    tablaPermisos = tablaPermisos.filter(estatus = "ACTIVO")
                    paginate_queryset = self.paginate_queryset(tablaPermisos)
                    serializer = self.serializer_class(paginate_queryset, many=True)
                    return self.get_paginated_response(serializer.data)
						
                else:
                    content = {
                        'status': 'no valido'
                    }
                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new tablaPermisos
    def post(self, request):
        if (request.user.profile.tipo =="Operador" or request.user.profile.tipo =="Paciente"): # If editors is who makes request
            serializer = TablaPermisosSerializer(data=request.data)
            serializerR = TablaPermisosSerializer(data=request.data)
            if serializerR.is_valid():
                medico = serializerR.data['Medico']
                paciente = serializerR.data['Paciente']
                email = serializerR.data['email']
                tipo = serializerR.data['tipo'] 
                caducidad = serializerR.data['caducidad'] 
                tablaPermisos = TablaPermisos.objects.all()
                if(tipo  == "EXTERNO"):
                    tablaPermisos = tablaPermisos.filter(Paciente__id = paciente)
                    tablaPermisos = tablaPermisos.filter(email = email)
                    if(not len(tablaPermisos)==0):
                        #coincidencia externa
                        if serializer.is_valid():
                            tablaPermiso = TablaPermisos.objects.get(pk=tablaPermisos[0].id)
                            tablaPermiso.caducidad = caducidad
                            tablaPermiso.save()
                            return Response(status=status.HTTP_200_OK)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
                    else:
                        if serializer.is_valid():
                            serializer.save(estatus = "ACTIVO")
                            return Response(serializer.data, status=status.HTTP_201_CREATED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                if(tipo  == "INTERNO"):
                    tablaPermisos = tablaPermisos.filter(Paciente__id = paciente)
                    tablaPermisos = tablaPermisos.filter(Medico__id = medico)
                    if(not len(tablaPermisos)==0):
                        # coincidencia interna
                        if serializer.is_valid():
                            tablaPermiso = TablaPermisos.objects.get(pk=tablaPermisos[0].id)
                            tablaPermiso.caducidad = caducidad
                            tablaPermiso.save()
                            return Response(status=status.HTTP_200_OK)
                        return Response(serializer.data, status=status.HTTP_200_OK)
                    else:
                        if serializer.is_valid():
                            serializer.save(estatus = "ACTIVO")
                            return Response(serializer.data, status=status.HTTP_201_CREATED)
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'Tipo de usuario no autorizado'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_tablaPermisosMed(RetrieveUpdateDestroyAPIView):
    serializer_class = TablaPermisosSerializer

    def get_queryset(self, pk):
        try:
            tablaPermisos = TablaPermisos.objects.get(pk=pk)
        except TablaPermisos.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return tablaPermisos

    # Get a tablaPermisos
    def get(self, request, pk, *args, **kwargs):
        try:
            tablaPermisos = TablaPermisos.objects.get(pk=pk)
        except TablaPermisos.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        tablaPermisos = self.get_queryset(pk)
        if (request.user.profile.tipo =="Medico"):  # If editors is who makes request
            if (request.user.profile.id_sem == tablaPermisos.Medico__id):  # If editors is who makes request
                fecha = date.today()
                if(tablaPermisos.caducidad < fecha):
                    if(tablaPermisos.estatus == "ACTIVA"):
                        serializer = TablaPermisosSerializer(tablaPermisos)
                        return Response(serializer.data, status=status.HTTP_200_OK)
                    else:
                        content = {
                            'status': 'Usuario no autorizado'
                        }
                        return Response(content, status=status.HTTP_401_UNAUTHORIZED)	
                else:
                    content = {
                        'status': 'Usuario no autorizado'
                    }
                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)	
            else:
                content = {
                    'status': 'Usuario no autorizado'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'Tipo de usuario no autorizado'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a tablaPermisos
    def put(self, request, pk, *args, **kwargs):
        try:
            tablaPermisos = TablaPermisos.objects.get(pk=pk)
        except TablaPermisos.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        tablaPermisos = self.get_queryset(pk)
        if (request.user.profile.id_sem == tablaPermisos.Medico__id): # If editors is who makes request
            serializer = TablaPermisosSerializer(tablaPermisos, data=request.data)		
            serializerR = TablaPermisosSerializer(tablaPermisos, data=request.data)
            if(serializerR.is_valid()):
                if(not(serializerR.data['token'])or(serializerR.data['caducidad'])or(serializerR.data['email'])or(serializerR.data['tipo'])or(serializerR.data['Medico'])or(serializerR.data['Paciente'])or(serializerR.data['creador'])or(serializerR.data['editor'])):
                    if serializer.is_valid():
                        serializer.save()
                    else:
                        content = {
                            'status': 'No valido'
                        }
                        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                else:
                    content = {
                        'status': 'No valido'
                    }
                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a tablaPermisos
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_tablaPermisosMed(ListCreateAPIView):
    serializer_class = TablaPermisosPacSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
       tablaPermisos = TablaPermisos.objects.all()
       return tablaPermisos

    # Get all tablaPermisos
    def get(self, request, *args, **kwargs):
        tablaPermisos = self.get_queryset()
        if (request.user.profile.tipo =="Medico"): # If editors is who makes request
            tablaPermisos = tablaPermisos.filter(Medico__id = request.user.profile.id_sem)
            fecha = date.today()
            tablaPermisos = tablaPermisos.filter(caducidad__gt = fecha)
            tablaPermisos = tablaPermisos.filter(estatus = "ACTIVO")
            paginate_queryset = self.paginate_queryset(tablaPermisos)
            serializer = self.serializer_class(paginate_queryset, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new tablaPermisos
    def post(self, request):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_pacienteExt(RetrieveUpdateDestroyAPIView):
    serializer_class = PacienteSerializer

    def get_queryset(self, pk):
        try:
            paciente = Paciente.objects.get(pk=pk)
        except Paciente.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return paciente

    # Get a paciente Ext
    def get(self, request, pk, *args, **kwargs):
        queryToken = False
        queryToken = self.request.GET.get("token")
        queryTokenId = False
        queryTokenId = self.request.GET.get("id")
        try:
            queryTokenId= int(queryTokenId)
        except ValueError:
            print("error de estructura")
            raise ValidationError(detail='Error en estrucutra de los campos')
        try:
            paciente = Paciente.objects.get(pk=pk)
        except Paciente.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        paciente = self.get_queryset(pk)
        if(queryToken and queryTokenId):
            tablaPermisos = TablaPermisos.objects.all()
            tablaPermisos= tablaPermisos.filter(id=queryTokenId)
            if(tablaPermisos[0].token == queryToken):
                serializer = PacienteSerializer(paciente)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                content = {
                    'status': 'Token Invalido'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
				'status': 'Token Invalido'
			}
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)
		

    # Update a paciente Ext
    def put(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
		

    # Delete a paciente Ext
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_consultasExt(ListCreateAPIView):
    serializer_class = ConsultaSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
       consultas = Consulta.objects.all()
       return consultas

    # Get all consultas
    def get(self, request, *args, **kwargs):
        print("entra")
        consultas = self.get_queryset()
        idPaciente = False
        idPaciente = self.request.GET.get("paciente")
        queryToken = False
        queryToken = self.request.GET.get("token")
        queryTokenId = False
        queryTokenId = self.request.GET.get("id")
        especialidad = False
        especialidad = self.request.GET.get("especialidad")
        fecha = False
        fecha = self.request.GET.get("fecha")
        if(queryToken and queryTokenId):
            tablaPermisos = TablaPermisos.objects.all()
            tablaPermisos= tablaPermisos.filter(id=queryTokenId)
            if(tablaPermisos[0].token == queryToken):
                if(idPaciente):
                    consultas = consultas.filter(Paciente__id = idPaciente)
                    if(especialidad):
                        print("especialidad")
                        if(not especialidad=='All'):
                            consultas = consultas.filter(especialidad = especialidad)
                    if(fecha):
                        print("fecha")
                        today = date.today()
                        if(fecha=='Year'):
                            print(today.year)
                            consultas = consultas.filter(creacion__year = today.year)
                        if(fecha=='Month'):
                            consultas = consultas.filter(creacion__month = today.month)
                    consultas = consultas.order_by('-creacion')
                    paginate_queryset = self.paginate_queryset(consultas)
                    serializer = self.serializer_class(paginate_queryset, many=True)
                    return self.get_paginated_response(serializer.data)
                else:
                    content = {
                        'status': 'No puedes consultar todas las consultas'
                    }
                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)
            else:
                    content = {
                        'status': 'Token Invalido'
                    }
                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'Token Invalido'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new consulta
    def post(self, request):
        serializer = ConsultaSerializer(data=request.data)
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_historiaClinicasExt(ListCreateAPIView):
    serializer_class = HistoriaClinicaSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
       historiaClinicas = HistoriaClinica.objects.all()
       return historiaClinicas

    # Get all historiaClinicas
    def get(self, request, *args, **kwargs):
        historiaClinicas = self.get_queryset()
        idPaciente = False
        idPaciente = self.request.GET.get("paciente")
        queryToken = False
        queryToken = self.request.GET.get("token")
        queryTokenId = False
        queryTokenId = self.request.GET.get("id")
        if(queryToken and queryTokenId):
            tablaPermisos = TablaPermisos.objects.all()
            tablaPermisos= tablaPermisos.filter(id=queryTokenId)
            if(tablaPermisos[0].token == queryToken):
                if(idPaciente):
                    historiaClinicas = historiaClinicas.filter(Paciente__id = idPaciente).order_by('-creacion')
                    paginate_queryset = self.paginate_queryset(historiaClinicas)
                    serializer = self.serializer_class(paginate_queryset, many=True)
                    return self.get_paginated_response(serializer.data)
                else:
                    content = {
                        'status': 'No puedes consultar todos los pacientes'
                    }
                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)
            else:
                content = {
                    'status': 'Token Invalido'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)                    
        else:
            content = {
                'status': 'Token Invalido'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new historiaClinica
    def post(self, request):
        serializer = HistoriaClinicaSerializer(data=request.data)
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_estudiosExt(ListCreateAPIView):
    serializer_class = EstudioSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
       estudios = Estudio.objects.all()
       return estudios

    # Get all estudios
    def get(self, request, *args, **kwargs):
        estudios = self.get_queryset()
        idPaciente = False
        idPaciente = self.request.GET.get("paciente")
        queryToken = False
        queryToken = self.request.GET.get("token")
        queryTokenId = False
        queryTokenId = self.request.GET.get("id")
        if(queryToken and queryTokenId):
            tablaPermisos = TablaPermisos.objects.all()
            tablaPermisos= tablaPermisos.filter(id=queryTokenId)
            if(tablaPermisos[0].token == queryToken):
                if(idPaciente):
                    estudios = estudios.filter(Paciente__id = idPaciente)
                    paginate_queryset = self.paginate_queryset(estudios)
                    serializer = self.serializer_class(paginate_queryset, many=True)
                    return self.get_paginated_response(serializer.data)
                else:
                    content = {
                        'status': 'No puedes consultar todos los pacientes'
                    }
                    return Response(content, status=status.HTTP_401_UNAUTHORIZED)
            else:
                content = {
                    'status': 'Token Invalido'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'Token Invalido'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new estudio
    def post(self, request):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_delete_update_medicoAdmin(RetrieveUpdateDestroyAPIView):
    serializer_class = MedicoSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            medico = Medico.objects.get(pk=pk)
        except Medico.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return medico

    # Get a medico
    def get(self, request, pk, *args, **kwargs):
        try:
            medico = Medico.objects.get(pk=pk)
        except Medico.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        medico = self.get_queryset(pk)
        if (request.user.profile.tipo =="Administrador"):  # If Administrador is who makes request
            serializer = MedicoSerializer(medico)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                    'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a medico
    def put(self, request, pk, *args, **kwargs):
        print("entra")
        try:
            medico = Medico.objects.get(pk=pk)
        except Medico.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        medico = self.get_queryset(pk)
        if(request.user.profile.tipo =="Administrador"): 
            serializer = MedicoSerializer(medico, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a medico
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_medicosAdmin(ListCreateAPIView):
    serializer_class = MedicoSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       medicos = Medico.objects.all()
       return medicos

    # Get all medicos 
    def get(self, request, *args, **kwargs):
        if (request.user.profile.tipo =="Administrador"):  # If Administrador is who makes request
            medicos = self.get_queryset()
            tipo = False
            tipo = self.request.GET.get("tipo")
            print(tipo)
            if(tipo):
                if(not tipo=='All'):
                    medicos = medicos.filter(verificado = tipo)
            paginate_queryset = self.paginate_queryset(medicos)
            serializer = MedicoSerializer(paginate_queryset, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            print("Usuario no autorizado")
            content = {
                'status': 'Usuario no autorizado'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new Medico
    def post(self, request):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_tablaPermisosUpdate(ListCreateAPIView):
    serializer_class = TablaPermisosMedSerializer
    pagination_class = CustomPagination
    

    # Get all tablaPermisos
    def get(self, request, *args, **kwargs):
        if (request.user.profile.tipo =="Administrador"):  # If Medico is who makes request
            email = False
            email = self.request.GET.get("email")
            print(email)
            if(email):
                medico = Medico.objects.get(email=email)
                tablaPermisos = TablaPermisos.objects.all()
                tablaPermisos = tablaPermisos.filter(email = medico.email)
                i=0
                print(len(tablaPermisos))
                if(len(tablaPermisos)):
                    while(i<len(tablaPermisos)):
                        print("iteracion")
                        if( not tablaPermisos[i].Medico):
                            print(tablaPermisos[i].id)
                            tablaPermisos[i].Medico = medico
                            tablaPermisos[i].editor = "Primer ingreso."
                            tablaPermisos[i].tipo = "INTERNO"
                            tablaPermisos[i].save()
                        i=i+1
                paginate_queryset = self.paginate_queryset(tablaPermisos)
                serializer = self.serializer_class(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
            else:
                content = {
                    'status': 'Medico no definido'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)

        else:
            content = {
                'status': 'Usuario no autorizado'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new tablaPermisos
    def post(self, request):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_delete_update_historicoPago(RetrieveUpdateDestroyAPIView):
    serializer_class = HistoricoPagoSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)


    # Get a historicoPago
    def get(self, request, pk, *args, **kwargs):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a historicoPago
    def put(self, request, pk, *args, **kwargs):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
		

    # Delete a historicoPago
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
   

class get_post_historicoPagos(ListCreateAPIView):
    serializer_class = HistoricoPagoSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    

    # Get all historicoPagos
    def get(self, request, *args, **kwargs):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new HistoricoPago
    def post(self, request):
        serializer = HistoricoPagoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class get_post_consultasClientessPaciente(ListCreateAPIView):
    serializer_class = ConsultasClientesSerializer
    pagination_class = CustomPagination

    
    def get_queryset(self):
       cosnsultasClientess = ConsultasClientes.objects.all()
       return consultassClientess

    # Get all consultasClientess
    def get(self, request, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED) 

    # Create a new consultasClientes
    def post(self, request):
        serializer = ConsultasClientesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class get_post_loginClientes(ListCreateAPIView):
    serializer_class = LoginClientesSerializer
    pagination_class = CustomPagination

    
    def get_queryset(self):
       loginClientes = LoginClientes.objects.all()
       return loginClientes

    # Get all loginClientes
    def get(self, request, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED) 

    # Create a new LoginClientes
    def post(self, request):
        serializer = LoginClientesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class get_delete_update_callCenterOp(RetrieveUpdateDestroyAPIView):
    serializer_class = CallCenterSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            callCenter = CallCenter.objects.get(pk=pk)
        except CallCenter.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return callCenter


    # Get a callCenter
    def get(self, request, pk, *args, **kwargs):
        try:
            callCenter = CallCenter.objects.get(pk=pk)
        except CallCenter.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        callCenter = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            serializer = CallCenterSerializer(callCenter)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a callCenter
    def put(self, request, pk, *args, **kwargs):
        try:
            callCenter = CallCenter.objects.get(pk=pk)
        except CallCenter.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        callCenter = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            serializer = CallCenterSerializer(callCenter, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a callCenter
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_callCentersOp(ListCreateAPIView):
    serializer_class = CallCenterSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       callCenters = CallCenter.objects.all()
       return callCenters

    # Get all callCenters
    def get(self, request, *args, **kwargs):
        callCenters = self.get_queryset()
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            #today = datetime.today()
            #first = today.replace(day=1)
            #lastMonth = first - timedelta(days=1)
            #lastMonth = lastMonth.replace(day=1) 
            #callCenters = callCenters.filter(creacion__gte= lastMonth).order_by('-id')
            paginate_queryset = self.paginate_queryset(callCenters)
            serializer = self.serializer_class(paginate_queryset, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new callCenter
    def post(self, request):
        serializer = CallCenterSerializer(data=request.data)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_post_Correos(ListCreateAPIView):
    serializer_class = CorreoSerializer
    
    # Get all Correos
    def get(self, request, *args, **kwargs):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new Correo
    def post(self, request):
        serializer = CorreoSerializer(data=request.data)
        serializerR = CorreoSerializer(data=request.data)
        if(serializerR.is_valid()):
            nombre=serializerR.data['nombre']
            telefono=serializerR.data['telefono']
            email=serializerR.data['email']
            comentario=serializerR.data['comentario']
            mensaje = "Nombre: {} Telefono: {} Email: {} Comentario: {}".format(nombre ,telefono ,email ,comentario)
            send_mail(nombre ,mensaje,'info@semin.mx',['info@semin.mx'],fail_silently=False,)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_post_versionCliente(ListCreateAPIView):
    serializer_class = VersionClienteSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
       versionCliente = VersionCliente.objects.all()
       return versionCliente


     # Get all versionCliente
    def get(self, request, *args, **kwargs):
        versionCliente = self.get_queryset()
        paginate_queryset = self.paginate_queryset(versionCliente)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)



    # Create a new versionCliente
    def post(self, request):
        content = {
            'status': 'No valido'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_fondoLogin(ListCreateAPIView):
    serializer_class = FondoLoginSerializer
    pagination_class = CustomPagination
    
    def get_queryset(self):
       fondoLogin = FondoLogin.objects.all()
       return fondoLogin


     # Get all fondoLogin
    def get(self, request, *args, **kwargs):
        fondoLogin = self.get_queryset()
        paginate_queryset = self.paginate_queryset(fondoLogin)
        serializer = self.serializer_class(paginate_queryset, many=True)
        return self.get_paginated_response(serializer.data)



    # Create a new fondoLogin
    def post(self, request):
        content = {
            'status': 'No valido'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_comentariosOp(RetrieveUpdateDestroyAPIView):
    serializer_class = ComentariosSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            comentarios = Comentarios.objects.get(pk=pk)
        except Comentarios.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return comentarios


    # Get a comentarios
    def get(self, request, pk, *args, **kwargs):
        try:
            comentarios = Comentarios.objects.get(pk=pk)
        except Comentarios.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        comentarios = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            serializer = ComentariosSerializer(comentarios)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a comentarios
    def put(self, request, pk, *args, **kwargs):
        try:
            comentarios = Comentarios.objects.get(pk=pk)
        except Comentarios.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        comentarios = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            serializer = ComentariosSerializer(comentarios, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a comentarios
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
		

class get_post_comentariossOp(ListCreateAPIView):
    serializer_class = ComentariosMinSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       comentarioss = Comentarios.objects.all()
       return comentarioss

    # Get all comentarioss
    def get(self, request, *args, **kwargs):
        comentarioss = self.get_queryset()
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            today = datetime.today()
            first = today.replace(day=1)
            lastMonth = first - timedelta(days=1)
            lastMonth = lastMonth.replace(day=1) 
            comentarioss = comentarioss.filter(creacion__gte= lastMonth)
            paginate_queryset = self.paginate_queryset(comentarioss)
            serializer = self.serializer_class(paginate_queryset, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new comentarios
    def post(self, request):
        serializer = ComentariosSerializer(data=request.data)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_quejasSugerenciasOp(RetrieveUpdateDestroyAPIView):
    serializer_class = QuejasSugerenciasSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            quejasSugerencias = QuejasSugerencias.objects.get(pk=pk)
        except QuejasSugerencias.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return quejasSugerencias


    # Get a quejasSugerencias
    def get(self, request, pk, *args, **kwargs):
        try:
            quejasSugerencias = QuejasSugerencias.objects.get(pk=pk)
        except QuejasSugerencias.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        quejasSugerencias = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            serializer = QuejasSugerenciasSerializer(quejasSugerencias)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a quejasSugerencias
    def put(self, request, pk, *args, **kwargs):
        try:
            quejasSugerencias = QuejasSugerencias.objects.get(pk=pk)
        except QuejasSugerencias.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        quejasSugerencias = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            serializer = QuejasSugerenciasSerializer(quejasSugerencias, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Delete a quejasSugerencias
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)
		

class get_post_quejasSugerenciassOp(ListCreateAPIView):
    serializer_class = QuejasSugerenciasMinSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       quejasSugerenciass = QuejasSugerencias.objects.all()
       return quejasSugerenciass

    # Get all quejasSugerenciass
    def get(self, request, *args, **kwargs):
        quejasSugerenciass = self.get_queryset()
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            today = datetime.today()
            first = today.replace(day=1)
            lastMonth = first - timedelta(days=1)
            lastMonth = lastMonth.replace(day=1) 
            quejasSugerenciass = quejasSugerenciass.filter(creacion__gte= lastMonth)
            paginate_queryset = self.paginate_queryset(quejasSugerenciass)
            serializer = self.serializer_class(paginate_queryset, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new quejasSugerencias
    def post(self, request):
        serializer = QuejasSugerenciasSerializer(data=request.data)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_delete_update_estudioEmpresaOp(RetrieveUpdateDestroyAPIView):
    serializer_class = EstudioEmpresaSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly,)

    def get_queryset(self, pk):
        try:
            estudioEmpresa = EstudioEmpresa.objects.get(pk=pk)
        except EstudioEmpresa.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        return estudioEmpresa

    # Get a estudioEmpresa
    def get(self, request, pk, *args, **kwargs):
        try:
            estudioEmpresa = EstudioEmpresa.objects.get(pk=pk)
        except EstudioEmpresa.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        estudioEmpresa = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"):  # If editors is who makes request
            serializer = EstudioEmpresaDetailSerializer(estudioEmpresa)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Update a estudioEmpresa
    def put(self, request, pk, *args, **kwargs):
        try:
            estudioEmpresa = EstudioEmpresa.objects.get(pk=pk)
        except EstudioEmpresa.DoesNotExist:
            content = {
                'status': 'Not Found'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        estudioEmpresa = self.get_queryset(pk)
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            serializer = EstudioEmpresaSerializer(estudioEmpresa, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)
			
    # Delete a estudioEmpresa
    def delete(self, request, pk, *args, **kwargs):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_estudioEmpresasOp(ListCreateAPIView):
    parser_class = (FileUploadParser,)
    serializer_class = EstudioEmpresaListSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       estudioEmpresas = EstudioEmpresa.objects.all()
       return estudioEmpresas

    # Get all estudioEmpresas
    def get(self, request, *args, **kwargs):
        if (request.user.profile.tipo =="Operador"):  # If editors is who makes request
            estudioEmpresas = self.get_queryset()
            paginate_queryset = self.paginate_queryset(estudioEmpresas)
            serializer = self.serializer_class(paginate_queryset, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)    

    # Create a new estudioEmpresa
    def post(self, request):
        serializer = EstudioEmpresaSerializer(data=request.data)
        if (request.user.profile.tipo == "Operador"):  # If editors is who makes request
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_empresasOp(ListCreateAPIView):
    serializer_class = EmpresaSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       empresas = Empresa.objects.all()
       return empresas

    # Get all empresas
    def get(self, request, *args, **kwargs):
        if (request.user.profile.tipo =="Operador"):  # If editors is who makes request
            empresas = self.get_queryset()
            paginate_queryset = self.paginate_queryset(empresas)
            serializer = self.serializer_class(paginate_queryset, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)    

    # Create a new Empresa
    def post(self, request):
        content = {
            'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

class get_post_registroVideollamada(ListCreateAPIView):
    serializer_class = RegistroVideollamadaSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       registroVideollamada = RegistroVideollamada.objects.all()
       return registroVideollamada

    # Get all registroVideollamada
    def get(self, request, *args, **kwargs):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new RegistroVideollamada
    def post(self, request):
        serializer = RegistroVideollamadaSerializer(data=request.data)
        if (request.user.profile.tipo =="Medico"): # If editors is who makes request	
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_registroVideollamada(ListCreateAPIView):
    serializer_class = RegistroVideollamadaSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    
    def get_queryset(self):
       registroVideollamada = RegistroVideollamada.objects.all()
       return registroVideollamada

    # Get all registroVideollamada
    def get(self, request, *args, **kwargs):
        content = {
                'status': 'UNAUTHORIZED'
        }
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    # Create a new RegistroVideollamada
    def post(self, request):
        serializer = RegistroVideollamadaSerializer(data=request.data)
        if (request.user.profile.tipo =="Medico"): # If editors is who makes request	
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


class get_post_pacienteSearchOp(ListCreateAPIView):
    serializer_class = PacienteSearchSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       paciente = EstudioEmpresa.objects.all()
       return paciente


    # Get all paciente
    def get(self, request, *args, **kwargs):
        queryBuscador = False
        queryBuscador = self.request.GET.get("queryBuscador")
        if (request.user.profile.tipo =="Operador"): # If editors is who makes request
            if(queryBuscador):
                pacientes = Paciente.objects.all()
                pacientes = pacientes.filter(Q(nombre__icontains=queryBuscador) | Q(apellido_paterno__icontains=queryBuscador) | Q(apellido_materno__icontains=queryBuscador)).distinct()
                paginate_queryset = self.paginate_queryset(pacientes)
                serializer = self.serializer_class(paginate_queryset, many=True)
                return self.get_paginated_response(serializer.data)
            else:
                content = {
                    'status': 'Sin valor de referencia'
                }
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new estudioEmpresa
    def post(self, request):
        content = {
            'status': 'Not Found'
        }

# Endpoints to work with Zoom and meetings
class get_post_update_delete_meeting(ListCreateAPIView):
    # Create new meeting
    def post(self, request, user_id="me"):

        data = json.loads(request.body)

        if(len(data) < 2):
            content = {
                'status': 'Error',
                'error': 'Not enough data'
            }

            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        

        client = ZoomClient(settings.API_KEY, settings.API_SECRET)
        # The zoom's API has another time zone, add 5 hrs to set a correct time
        start_time=datetime.strptime(data.get("start_time"), '%y/%m/%d %H:%M:%S')+ timedelta(hours=5)
        # Create meeting
        aditional_information = {
            "settings" :{
                "join_before_host" : True,
                "waiting_room": False
            }
        }
        new_meeting_response = client.meeting.create(user_id=user_id, topic=data.get("topic"), type=2, start_time=start_time, **aditional_information)
        

        if(new_meeting_response.status_code != 201):
            content = {
                'status': 'Error',
                'error': f'Meeting not created, code error {new_meeting_response.status_code}'
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)


        new_meeting = json.loads(new_meeting_response.content)

        
        content =  {
            'status': 'OK',
            'meeting_information': {
                'meeting_id' : new_meeting.get('id'),
                # 'meeting_password' : new_meeting.get('password'),
                'duration' : new_meeting.get('duration'),
                'start_time' : start_time    
                },
            'information': new_meeting
            }
        return Response(content, status=status.HTTP_200_OK)



    # List the meetings
    def get(self, request, user_id="me"):
        client = ZoomClient(settings.API_KEY, settings.API_SECRET)
        meeting_list_response = client.meeting.list(user_id=user_id)
        meeting_list = json.loads(meeting_list_response.content)

        content =  {
            'status': 'OK',
            'response': meeting_list
        }

        return Response(content, status=status.HTTP_200_OK)

    # Delete meeting
    def delete(self, request, user_id="me"):

        data = json.loads(request.body)

        meeting_id = data.get('meeting_id')
        
        if( meeting_id is None or meeting_id == ''):
            content = {
                'status': 'Error',
                'error': 'Missing meeting ID'
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        
        # Delete the meeting
        client = ZoomClient(settings.API_KEY, settings.API_SECRET)
        meeting_delete_response = client.meeting.delete(id=data.get('meeting_id'), user_id="me")
        
        if (meeting_delete_response.status_code == 404):
            content =  {
                'status': 'Error',
                "error": "Meeting not found"
            }
        
        elif (meeting_delete_response.status_code == 204):
            content =  {
                'status': 'OK',
                "error": "Meeting deleted"
            }
        else:
            content =  {
                'status': 'Error',
                "error": "Unknown error"
            }

        return Response(content, status=meeting_delete_response.status_code)


    # Create new meeting
    def put(self, request, user_id="me"):

        data = json.loads(request.body)
        meeting_id = data.get('meeting_id')

        if(len(data) < 2 or meeting_id is None or meeting_id == ''):
            content = {
                'status': 'Error',
                'error': 'Not enough data'
            }

            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        

        client = ZoomClient(settings.API_KEY, settings.API_SECRET)
        # The zoom's API has another time zone, add 5 hrs to set a correct time
        new_start_time=datetime.strptime(data.get("new_start_time"), '%y/%m/%d %H:%M:%S')+ timedelta(hours=5)
        meeting_update_response = client.meeting.update(host_id=user_id, id=meeting_id, start_time=new_start_time)
        print(meeting_update_response)

        if (meeting_update_response.status_code == 404):
            content =  {
                'status': 'Error',
                "error": "Meeting not found"
            }
        
        elif (meeting_update_response.status_code == 204):
            content =  {
                'status': 'OK',
                "error": "Meeting updated"
            }
        else:
            content =  {
                'status': 'Error',
                "error": "Unknown error"
            }

        return Response(content, status=meeting_update_response.status_code)


# Create a new rehabilitation dossier
class get_post_expedienteRehabilitacionOp(ListCreateAPIView):
    serializer_class = RehabilitacionSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination

    def get_queryset(self):
       expedienteRehabilitacion = Rehabilitacion.objects.all()
       return expedienteRehabilitacion

    def get(self, request, *args, **kwargs):
        return Response({'status': 'UNAUTHORIZED'}, status=status.HTTP_401_UNAUTHORIZED)

    # Create a new expediente (post)
    def post(self, request):
        serializer = RehabilitacionSerializer(data=request.data)
        if (request.user.profile.tipo == "Operador"):
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = {
                'status': 'UNAUTHORIZED'
            }
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'POST'])
def get_post_expedienteFisioMenorOp(request):
    permission_classes = (IsAuthenticated,)
    if request.method == 'GET':
        return Response({'status':'UNAUTHORIZED'}, status = status.HTTP_401_UNAUTHORIZED)
    else:
        serializer = RehabilitacionMenorSerializer(data=request.data)
        if (request.user.profile.tipo == "Operador"):
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'status':'NOT_ACCEPTABLE'}, status=status.HTTP_406_NOT_ACCEPTABLE)


@api_view(['GET'])
def get_post_expedienteFisio(request):
    permission_classes = (IsAuthenticated,)
    if request.method == 'GET':
        if (request.user.profile.tipo == "Fisioterapeuta"):
            user = Rehabilitacion.objects.all()
            user_serializer = RehabilitacionSerializer(user, many = True)
            return Response(user_serializer.data, status = status.HTTP_200_OK)
        return Response({'status':'NOT_AUTHORITATIVE_INFORMATION'}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
    return Response({'status':'NOT_ACCEPTABLE'}, status=status.HTTP_406_NOT_ACCEPTABLE)


@api_view(['GET'])
def get_delete_update_fisio(request, user_id):
    permission_classes = (IsAuthenticated,)
    user = Fisioterapeuta.objects.filter(id = user_id).first()
    if user:
        if request.method == 'GET':
            user_serializer = FisioterapeutaSerialazer(user)
            return Response(user_serializer.data, status = status.HTTP_200_OK)
        else: 
            return Response({'status':'UNAUTHORIZED'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({'message':'no registrado'}, status = status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def get_delete_update_expediente(request, pk):
    permission_classes = (IsAuthenticated,)
    exp = Rehabilitacion.objects.filter(id = pk).first()
    if exp:
        if request.method == 'GET':
            exp_serializer = RehabilitacionSerializer(exp)
            return Response(exp_serializer.data, status = status.HTTP_200_OK)
        elif request.method == 'PUT':
            exp_serializer = EditRehabilitacionSerializer(exp, data = request.data)
            print(exp_serializer)
            if exp_serializer.is_valid():
                exp_serializer.save()
                return Response(exp_serializer.data, status=status.HTTP_201_CREATED)
            return Response({'message':'No se pudo editar'}, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            return Response({'status':'UNAUTHORIZED'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({'message':'Expediente no encontrado ... UPS!'}, status = status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def search_expediente(request, termino):
    permission_classes = (IsAuthenticated,)
    if request.method == 'GET':
        exp = Rehabilitacion.objects.filter(Q(nombre__icontains=termino) | Q(apellido_paterno__icontains=termino) | Q(apellido_materno__icontains=termino)).all()
        if exp:
            exp_serializer = RehabilitacionSerializer(exp, many = True)
            return Response(exp_serializer.data, status = status.HTTP_200_OK)
        else:
            return Response({'message':'expediente no encontrado'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({'status':'UNAUTHORIZED'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET','POST'])
def get_post_temperaturas(request):
    permission_classes = (IsAuthenticated,)
    if request.method == 'GET':
        temperaturas = SensorTemperatura.objects.all()
        temperaturas_serializer = TemperaturaSensorSerialazer(temperaturas, many = True)
        return Response(temperaturas_serializer.data, status = status.HTTP_200_OK)
    else:
        serializer_temp = TemperaturaSensorSerialazer(data=request.data)
        if serialiazer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# almacen 
@api_view(['GET', 'POST'])
def get_post_productos_almacen(request):
    permission_classes = (IsAuthenticated,)
    if request.method == 'GET':
        user = Productos.objects.all()
        user_serializer = ProductosSerialazer(user, many = True)
        return Response(user_serializer.data, status = status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = ProductosSerialazer(data=request.data)
        if (request.user.profile.tipo == "Almacen"):
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def get_delete_update_producto_almacen(request, pk):
    permission_classes = (IsAuthenticated,)
    exp = Productos.objects.filter(id = pk).first()
    if exp:
        if request.method == 'GET':
            exp_serializer = ProductosSerialazer(exp)
            return Response(exp_serializer.data, status = status.HTTP_200_OK)
        elif request.method == 'PUT':
            exp_serializer = ProductosSerialazer(exp, data = request.data)
            if exp_serializer.is_valid():
                exp_serializer.save()
                return Response(exp_serializer.data, status=status.HTTP_201_CREATED)
            return Response({'message':'No se pudo editar'}, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            return Response({'status':'UNAUTHORIZED'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({'message':'Expediente no encontrado ... UPS!'}, status = status.HTTP_400_BAD_REQUEST)