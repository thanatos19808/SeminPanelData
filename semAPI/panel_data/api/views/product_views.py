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

from semin.models import Empleado
from panel_data.models.finanzas_models import *
from ..serializers.finanzas_serializer import *


@api_view(['GET', 'POST'])
def get_user_num_studies(request):
    if request.method == 'GET':
        userID = request.GET.get("id","")
        movimientos = Movimientos.objects.all()
        dataUser = movimientos.filter(cajero__cajero_empleado__id = userID)
        if dataUser:
            data_user_serializer = MovimientoCajaSerializer(dataUser, many=True)
            return Response(
                data_user_serializer.data,
                status = status.HTTP_200_OK
            )
        return Response(
            {'message':'NOT DATA'},
            status = status.HTTP_404_NOT_FOUND
        )
    else:
        return Response(
            {
                'status':'NOT_ACCEPTABLE'
            },
            status=status.HTTP_406_NOT_ACCEPTABLE
        )