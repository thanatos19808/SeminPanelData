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
from ..serializers.finanzas_serializer import *
from semin.serializers import SucursalNameSerializer, EstudioSerializer
from semin.models import Empleado


@api_view(['GET', 'POST'])
def get_post_empleados_user(request):
    if request.method == 'GET':
        queryPuesto = request.GET.get('puesto', '').lower()
        if(queryPuesto == 'cajero'):
            cajero = CajeroOperador.objects.all()
            cajeros_serializer = CajeroSerializer(cajero, many=True)
            return Response(
                cajeros_serializer.data,
                status = status.HTTP_200_OK
            )
        empleados = Empleado.objects.all()
        filterPuesto = empleados.filter(Q(puesto__icontains = queryPuesto))
        puesto_serializer = users_puesto_serializer(filterPuesto, many=True)
        return Response(
            puesto_serializer.data,
            status = status.HTTP_200_OK
        )
    else:
        return Response(
            {
                'status':'NOT_ACCEPTABLE'
            },
            status=status.HTTP_406_NOT_ACCEPTABLE
        )


@require_http_methods(['GET', 'POST'])
@api_view(['GET', 'POST'])
def get_post_corte_caja(request):
    if request.method == 'GET':
        #validar autorizacion
        allBox = Movimientos.objects.all()

        queryEmpresa = request.GET.get("empresa","").lower()
        querySucursal = request.GET.get("sucursal","").lower()
        queryMinDate = request.GET.get("min_date","")
        queryMaxDate = request.GET.get("max_date","")

        if(not(queryEmpresa and querySucursal)):
            print('no se filtra por empresa ni por sucursal')
            return Response(
                {'message':'Bad Request!...'},
                status = status.HTTP_400_BAD_REQUEST
            )
        else:
            print('tiene parametros la url')
            filterEmpresa = allBox.filter(Q(apertura_cierre__empresa__icontains = queryEmpresa))
            filterSucursal = filterEmpresa.filter(Q(apertura_cierre__sucursal__nombreSucursal__icontains = querySucursal))

            if(not(queryMinDate or queryMaxDate)):
                print("retorna valores sin filtro de fecha")
                filter_with_date = MovimientoCajaSerializer(filterSucursal, many=True)
                return Response(
                    filter_with_date.data,
                    status = status.HTTP_200_OK
                )
            print("filtando por fecha")
            filterDate1 = filterSucursal.filter(Q(apertura_cierre__date__gte = queryMinDate ))
            filterDate2 = filterDate1.filter(Q(apertura_cierre__date__lte = queryMaxDate ))
            print(filterDate2,'regresando la filtracion por fecha')
            filter_by_date = MovimientoCajaSerializer(filterDate2, many=True) 
            return Response(
                filter_by_date.data,
                status = status.HTTP_200_OK
            )
    else:
        return Response(
            {
                'status':'NOT_ACCEPTABLE'
            },
            status=status.HTTP_406_NOT_ACCEPTABLE
        )


@api_view(['GET'])
def get_devoluciones(request):
    if request.method == 'GET':
        all_devoluciones = Devoluciones.objects.all()

        queryEmpresa = request.GET.get("empresa","").lower()
        querySucursal = request.GET.get("sucursal","").lower()
        queryMinDate = request.GET.get("min_date","")
        queryMaxDate = request.GET.get("max_date","")

        if (not(queryEmpresa and querySucursal)):
            return Response(
                {'message':'We need params!'},
                status=status.HTTP_400_BAD_REQUEST
            )
        filterEmpresa = all_devoluciones.filter(Q(empresa__contains = queryEmpresa))
        filterSucursal = filterEmpresa.filter(Q(sucursal__nombreSucursal__contains = querySucursal))
        if(not(queryMinDate and queryMaxDate)):
            print('sin filtro de fecha')
            devoluciones_serializer = DevolucionesSerializer(filterSucursal, many=True)
            return Response(
                devoluciones_serializer.data, 
                status=status.HTTP_200_OK
            )
        filterDate = filterSucursal.filter(Q(date__gte = queryMinDate))
        filterDate2 = filterDate.filter(Q(date__lte = queryMaxDate))
        devoluciones_serializer = DevolucionesSerializer(filterDate2, many=True)
        print('con filtro de fecha')
        return Response(
            devoluciones_serializer.data, 
            status=status.HTTP_200_OK
        )


@api_view(['GET'])
def get_type_devoluciones(request):
    if request.method == 'GET':
        all_devoluciones = Devoluciones.objects.all()

        queryEmpresa = request.GET.get("empresa","").lower()
        querySucursal = request.GET.get("sucursal","").lower()
        queryType = request.GET.get("type","").lower().lower()
        queryMinDate = request.GET.get("min_date","")
        queryMaxDate = request.GET.get("max_date","")

        if (not(queryEmpresa and querySucursal and queryType)):
            return Response(
                {'message':'We need params!'},
                status=status.HTTP_400_BAD_REQUEST
            )
        filterEmpresa = all_devoluciones.filter(Q(empresa__contains = queryEmpresa))
        filterSucursal = filterEmpresa.filter(Q(sucursal__nombreSucursal__contains = querySucursal))
        filterType = filterEmpresa.filter(Q(tipo_devolucion__contains = queryType))
        if(not(queryMinDate and queryMaxDate)):
            print('sin filtro de fecha')
            devoluciones_serializer = DevolucionesSerializer(filterType, many=True)
            return Response(
                devoluciones_serializer.data, 
                status=status.HTTP_200_OK
            )
        filterDate = filterType.filter(Q(date__gte=queryMinDate))
        filterDat2 = filterDate.filter(Q(date__lte=queryMaxDate))
        devoluciones_serializer = DevolucionesSerializer(filterDat2, many=True)
        print('con filtro de fecha')
        return Response(
            devoluciones_serializer.data, 
            status=status.HTTP_200_OK
        )