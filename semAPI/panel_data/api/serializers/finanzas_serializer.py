from rest_framework import serializers

from semin.serializers import *
from panel_data.models.ventas_models import *
from panel_data.models.finanzas_models import *
from semin.models import Empleado


class users_puesto_serializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        exclude = (
            "creacion",
            "ultimaActualizacion"
        )


class CajeroSerializer(serializers.ModelSerializer):
    cajero_empleado = users_puesto_serializer(required=False)
    sucursal = SucursalNameSerializer(required=False)
    class Meta:
        model = CajeroOperador
        exclude = (
            "creacion",
        )


class AperturaCierreCajaSerializer(serializers.ModelSerializer):
    sucursal = SucursalNameSerializer(required=False)
    class Meta:
        model = AperturaCierreCaja
        fields = (
            "__all__"
        )


#this is the serializer enterpoint
class MovimientoCajaSerializer(serializers.ModelSerializer):
    cajero = CajeroSerializer(required=False)
    apertura_cierre = AperturaCierreCajaSerializer(required=False)
    class Meta:
        model = Movimientos
        fields = (
            "__all__"
        )


class DevolucionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devoluciones
        fields = (
            "tipo_devolucion",
            "total",
        )