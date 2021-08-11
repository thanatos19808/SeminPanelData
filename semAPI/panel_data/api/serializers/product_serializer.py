from rest_framework import serializers

from semin.models import Empleado
from panel_data.models.finanzas_models import Movimientos
from panel_data.api.serializers.finanzas_serializer import CajeroSerializer, AperturaCierreCajaSerializer


# class user_num_estudies_serializer(serializers.ModelSerializer):
#     cajero = CajeroSerializer(required=False)
#     apertura_cierre = AperturaCierreCajaSerializer(required=False)
#     class Meta:
#         model = Movimientos
#         exclude = (
#             "creacion",
#             "ultimaActualizacion"
#         )
