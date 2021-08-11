from rest_framework import serializers

from semin.serializers import *
from panel_data.models.ventas_models import *
from panel_data.models.finanzas_models import *
from panel_data.models.activities_models import *


class UserAdminPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAdminPanel
        fields = (
            "id",
            "email",
            "nombre",
            "apellido_paterno",
            "apellido_materno",
        )


class GetUsersAdministratorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAdmin
        fields = (
            "__all__"
        )
        

class GetUserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAdmin
        fields = (
            "id",
            "email",
            "nombre",
            "apellido_paterno",
            "apellido_materno",
        )


class GetPermisosAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAdmin
        fields = (
            "nombre",
            "venta_tolal",
            "venta_sucursal",
            "venta_estudios",
            "venta_departamentos",
            "venta_areas",
            "corte_caja",
            "tipos_pagos",
            "devoluciones",
            "cambio_estudio",
        )


class ActivityLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLogin
        fields = (
            "__all__"
        )


class GetActivityLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLogin
        exclude = (
            "ultimaActualizacion",
        )


class PostActivityViewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityViews
        fields = (
            "__all__"
        )


class GetActivityViewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityViews
        exclude = (
            "ultimaActualizacion",
        )