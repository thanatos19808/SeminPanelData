from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from semin.permissions import IsOwnerOrReadOnly, IsAuthenticated
from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from django.http import HttpResponse
from django.http import JsonResponse
from django.db.models import Q
from django.core.handlers.wsgi import WSGIRequest

from panel_data.models import *
from semin.serializers import SucursalNameSerializer, EstudioSerializer
from panel_data.utils.activities import InsertData

from panel_data.models.activities_models import *
from panel_data.api.serializers.activities_serializer import * 

# login para el panel data
@api_view(['GET'])
def get_post_loginAud(request):
    if request.method == 'GET':
        queryEmail = request.GET.get('email', "")
        user = UserAdminPanel.objects.filter(email=queryEmail).first()
        if user:
            user_serializer = UserAdminPanelSerializer(user)
            return Response(user_serializer.data, status = status.HTTP_200_OK)
        return Response({'message':'no registrado'}, status = status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_post_loginAdmin(request):
    if request.method == 'GET':
        queryEmail = request.GET.get('email', "")
        user = UserAdmin.objects.filter(email=queryEmail).first()
        if user:
            user_serializer = GetUserAdminSerializer(user)
            return Response(user_serializer.data, status = status.HTTP_200_OK)
        return Response({'message':'no registrado'}, status = status.HTTP_400_BAD_REQUEST)


# get all administradores
@api_view(['GET'])
def get_administrators(request):
    if request.method == 'GET':
        if (request.user.profile.tipo == "Auditor_panel"):
            users = UserAdmin.objects.all()
            users_serializer = GetUsersAdministratorsSerializer(users, many = True)
            return Response(
                users_serializer.data, 
                status = status.HTTP_200_OK
            )
        return Response(
            {'status': 'UNAUTHORIZED'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    return Response(
        {'message':'error ...'},
        status = status.HTTP_400_BAD_REQUEST
    )


#get one administrator
@api_view(['GET','PUT'])
def get_put_one_admin(request, id):
    if request.method == 'GET':
        if (request.user.profile.tipo == "Auditor_panel"):
            user = UserAdmin.objects.filter(id = id).first()
            if user:
                users_serializer = GetUsersAdministratorsSerializer(user)
                return Response(
                    users_serializer.data, 
                    status = status.HTTP_200_OK
                )
            return Response(
                {'message':'UPS!... esto no debio pasar!'}, 
                status = status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {'status': 'UNAUTHORIZED'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    elif request.method == 'PUT':
        if (request.user.profile.tipo == "Auditor_panel"):
            users = UserAdmin.objects.filter(id = id).first()
            user_serializer = GetUsersAdministratorsSerializer(users, data = request.data)
            if user_serializer.is_valid():
                user_serializer.save()
                return Response(
                    {'message':'Actualizado'}, 
                    status=status.HTTP_201_CREATED
                )
            return Response({'message':'No se pudo editar'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'status': 'UNAUTHORIZED'}, status=status.HTTP_400_BAD_REQUEST)


# get permisos user admin
@api_view(['GET'])
def get_permisos_user(request):
    if request.method == 'GET':
        queryEmail = request.GET.get('email', "")
        user = UserAdmin.objects.filter(email=queryEmail).first()
        if user:
            user_serializer = GetPermisosAdminSerializer(user)
            return Response(user_serializer.data, status = status.HTTP_200_OK)
    return Response(
        {'message':'bad request'}, 
        status = status.HTTP_400_BAD_REQUEST
    )


# insertar y consultar el login que se realizo en el panel data, funcion privada
@api_view(['GET','POST'])
def get_post_activity_login(request):
    if request.method == 'GET':
        if (request.user.profile.tipo == "Auditor_panel"):
            activities = ActivityLogin.objects.all()
            activities_serializer = GetActivityLoginSerializer(activities, many = True)
            return Response(
                activities_serializer.data, 
                status = status.HTTP_200_OK
            )
        return Response(
            {'status': 'UNAUTHORIZED'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    elif request.method == 'POST':
        serializer_login = ActivityLoginSerializer(data=request.data)
        if serializer_login.is_valid():
            serializer_login.save()
            return Response(
                {'message':'created'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer_login.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET','POST'])
def get_post_activity_views(request):
    if request.method == 'GET':
        if (request.user.profile.tipo == "Auditor_panel"):
            activities = ActivityViews.objects.all()
            activities_serializer = GetActivityViewsSerializer(activities, many = True)
            return Response(
                activities_serializer.data, 
                status = status.HTTP_200_OK
            )
        return Response(
            {'status': 'UNAUTHORIZED'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    elif request.method == 'POST':
        serializer_views = PostActivityViewsSerializer(data=request.data)
        if serializer_views.is_valid():
            serializer_views.save()
            return Response(
                {'message':'created'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer_views.errors, status=status.HTTP_400_BAD_REQUEST)


