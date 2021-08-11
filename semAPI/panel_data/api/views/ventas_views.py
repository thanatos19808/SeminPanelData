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
from semin.models import Empleado, Profile, USER_TYPE_CHOICES
from ..serializers.ventas_serializers import *
from semin.serializers import SucursalNameSerializer, EstudioSerializer


# Create views here.
@api_view(['GET'])
def get_sucursals(request):
    if request.method == 'GET':
        sucursals = Sucursal.objects.all()
        sucursals_serializer = SucursalNameSerializer(sucursals, many=True)
        return Response(
            sucursals_serializer.data,
            status = status.HTTP_200_OK
        )
    return Response(
        {
            'status':'NOT_ACCEPTABLE'
        }, 
        status=status.HTTP_406_NOT_ACCEPTABLE
    )


# filter by query
# hacer la vista de ventas totales de la empresa que se seleccione
@api_view(['GET','POST'])
def get_post_ventas_totales(request):
    if request.method == 'GET':
        all_ventas = VentasTotal.objects.all()
        queryEmpresa = request.GET.get('empresa', '').lower()
        queryFirstDate = request.GET.get("min_date", "")
        querySecondDate = request.GET.get("max_date", "")

        if(not(queryFirstDate and querySecondDate)):
            return Response(
                {'message': 'BAD REQUEST'},
                status = status.HTTP_400_BAD_REQUEST
            )
        filterEmpresa = all_ventas.filter(Q(empresa__icontains = queryEmpresa))
        filterDate = filterEmpresa.filter(Q(date__gte = queryFirstDate))
        filterDate2 = filterDate.filter(Q(date__lte = querySecondDate))
        ventas_serializer = VentasTotalSerializer(filterDate2, many = True)
        
        return Response(
            ventas_serializer.data,
            status = status.HTTP_200_OK
        )
    elif request.method == 'POST':
        ventas_serializer = VentasTotalSerializer(data=request.data)
        if ventas_serializer.is_valid():
            ventas_serializer.save()
            return Response(
                {'message':'created'},
                status=status.HTTP_201_CREATED
            )
        return Response(ventas_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# tenemos que sumar la venta de todas las sucursales y sacar los datos de caja creo


@require_http_methods(['GET', 'POST'])
@api_view(['GET', 'POST'])
def get_filter_all_venta_estudios(request): 
    permission_classes = (IsAuthenticated,)
    if request.method == 'GET':
        empleado_request = Empleado.objects.all()

        allVentasEstudios = VentaEstudios.objects.all()
        queryEmpresa = request.GET.get("empresa", "").lower()
        querySucursal = request.GET.get("sucursal", "").lower()
        queryEstudio = request.GET.get("estudio", "").lower()
        queryFirstDate = request.GET.get("min_date", "")
        querySecondDate = request.GET.get("max_date", "")

        if queryEmpresa != "":
            print('entrando al filtrado de datos')
            filterEmpresa = allVentasEstudios.filter(Q(empresa__icontains = queryEmpresa))
            filterSucursal = filterEmpresa.filter(Q(sucursal__nombreSucursal__icontains = querySucursal))
            filterEstudio = filterSucursal.filter(Q(estudio__icontains = queryEstudio))

            if queryFirstDate != "":
                print('entrando al filtro de fechas')
                filterDate = filterEstudio.filter(Q(date__gte = queryFirstDate))
                filterDate2 = filterDate.filter(Q(date__lte = querySecondDate))
                ventas_serializer = VentaEstudiosSerializer(filterDate2, many = True)
                return Response(
                    ventas_serializer.data,
                    status = status.HTTP_200_OK
                )
            ventas_serializer = VentaEstudiosSerializer(filterEstudio, many = True)
            return Response(
                ventas_serializer.data, 
                status = status.HTTP_200_OK
            )
        else:
            print('no tiene parametros en la url se consulta todo')
            all_ventas_serializer = VentaEstudiosSerializer(allVentasEstudios, many = True)
            return Response(
                all_ventas_serializer.data, 
                status = status.HTTP_200_OK
            )
    elif request.method == 'POST':
        return Response(
            {
                'status':'NOT_ACCEPTABLE'
            }, 
            status=status.HTTP_406_NOT_ACCEPTABLE
        )


@require_http_methods(['GET', 'POST'])
@api_view(['GET', 'POST'])
def get_filter_all_venta_departament(request): 
    permission_classes = (IsAuthenticated,)
    if request.method == 'GET':
        # validar si es operador
        allVentasDepartament = VentaDespartamentoArea.objects.all()
        queryEmpresa = request.GET.get("empresa", "").lower()
        querySucursal = request.GET.get("sucursal", "").lower()
        queryDepartament = request.GET.get("departament", "").lower()
        queryFirstDate = request.GET.get("min_date", "")
        querySecondDate = request.GET.get("max_date", "")
        
        if queryEmpresa != "":
            filterEmpresa = allVentasDepartament.filter(Q(empresa__icontains = queryEmpresa))
            filterSucursal = filterEmpresa.filter(Q(sucursal__nombreSucursal__icontains = querySucursal))
            filterDepartament = filterSucursal.filter(Q(departamento__icontains = queryDepartament))
            if queryFirstDate != "":
                filterDate = filterDepartament.filter(Q(date__gte = queryFirstDate))
                filterDate2 = filterDate.filter(Q(date__lte = querySecondDate))
                ventas_serializer = VentaDespartamentoSerializer(filterDate2, many = True)
                return Response(
                    ventas_serializer.data,
                    status = status.HTTP_200_OK
                )
            ventas_serializer = VentaDespartamentoSerializer(filterDepartament, many = True)
            return Response(
                ventas_serializer.data, 
                status = status.HTTP_200_OK
            )
        else:
            all_ventas_serializer = VentaDespartamentoSerializer(allVentasDepartament, many = True)
            return Response(
                all_ventas_serializer.data, 
                status = status.HTTP_200_OK
            )
    elif request.method == 'POST':
        return Response(
            {
                'status':'NOT_ACCEPTABLE'
            }, 
            status=status.HTTP_406_NOT_ACCEPTABLE
        )


# ventas por area endpoint principal
@require_http_methods(['GET'])
@api_view(['GET'])
def get_all_areas(request):
    permission_classes = (IsAuthenticated,)
    if request.method == 'GET':
        # validar si es operador
        alldata = VentaDespartamentoArea.objects.all()

        queryEmpresa = request.GET.get("empresa", "").lower()
        queryArea = request.GET.get("area", "").lower()
        queryFirstDate = request.GET.get("min_date", "")
        querySecondDate = request.GET.get("max_date", "")

        if(not(queryEmpresa and queryArea)):
            return Response(
                {"message":"error server"},
                status = status.HTTP_400_BAD_REQUEST
            )
        filterEmpresa = alldata.filter(Q(empresa__icontains = queryEmpresa))
        filterArea = filterEmpresa.filter(Q(area__icontains = queryArea))
        if(not(queryFirstDate and querySecondDate)):
            ventas_area__serializer = AllAreaSerializer(filterArea, many = True)
            return Response(
                ventas_area__serializer.data,
                status = status.HTTP_200_OK
            )
        filterDate = filterArea.filter(Q(date__gte = queryFirstDate))
        filterDate2 = filterDate.filter(Q(date__lte = querySecondDate))
        area_serializer = AllAreaSerializer(filterDate2, many=True)
        return Response(
            area_serializer.data, 
            status=status.HTTP_200_OK
        )


# sub consulta para el total de ventas por area
@require_http_methods(['GET'])
@api_view(['GET'])
def get_ventas_by_area(request): 
    permission_classes = (IsAuthenticated,)
    if request.method == 'GET':
        # validar si es operador
        alldata = VentaDespartamentoArea.objects.all()

        queryEmpresa = request.GET.get("empresa", "").lower()
        queryArea = request.GET.get("area", "").lower()
        queryDepartament = request.GET.get("departament", "").lower()
        queryFirstDate = request.GET.get("min_date", "")
        querySecondDate = request.GET.get("max_date", "")

        if(not(queryEmpresa and queryDepartament and queryArea)):
            return Response(
                {"message":"error server"},
                status = status.HTTP_400_BAD_REQUEST
            )
        filterEmpresa = alldata.filter(Q(empresa__icontains = queryEmpresa))
        filterArea = filterEmpresa.filter(Q(area__icontains = queryArea))
        filterDepartament = filterArea.filter(Q(departamento__icontains = queryDepartament))
        if(not(queryFirstDate and querySecondDate)):
            ventas_area__serializer = AreaSerializer(filterDepartament, many = True)
            return Response(
                ventas_area__serializer.data,
                status = status.HTTP_200_OK
            )
        filterDate = filterDepartament.filter(Q(date__gte = queryFirstDate))
        filterDate2 = filterDate.filter(Q(date__lte = querySecondDate))
        area_serializer = AreaSerializer(filterDate2, many=True)
        return Response(
            area_serializer.data, 
            status=status.HTTP_200_OK
        )