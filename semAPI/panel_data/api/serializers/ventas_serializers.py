from rest_framework import serializers

from semin.serializers import *
from panel_data.models.ventas_models import *

class VentaEstudiosSerializer(serializers.ModelSerializer):
    sucursal = SucursalNameSerializer(required=False)
    class Meta:
        model = VentaEstudios
        exclude = (
            "creacion",
            "ultimaActualizacion"
        )


class VentaDespartamentoSerializer(serializers.ModelSerializer):
    sucursal = SucursalNameSerializer(required=False)
    class Meta:
        model = VentaDespartamentoArea
        exclude = (
            "creacion",
            "ultimaActualizacion"
        )


class AllAreaSerializer(serializers.ModelSerializer):
    sucursal = SucursalNameSerializer(required=False)
    class Meta:
        model = VentaDespartamentoArea
        fields = (
            "id",
            "sucursal",
            "departamento",
            "area",
            "numero_estudios",
            "total",
            "date",
        )


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = VentaDespartamentoArea
        fields = (
            "departamento",
            "area",
            "total",
            "date",
        )


class VentasTotalSerializer(serializers.ModelSerializer):
    class Meta:
        model = VentasTotal
        fields = ("__all__")