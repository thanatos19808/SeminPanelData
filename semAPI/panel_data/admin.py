from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from panel_data.models.ventas_models import *
from panel_data.models.finanzas_models import *
from panel_data.models.activities_models import UserAdminPanel, UserAdmin, ActivityLogin, ActivityViews

class UserAdminPanelAdmin(ImportExportModelAdmin):
    pass 
    list_display = (
        "id",
        "nombre",
        "apellido_paterno",
        "apellido_materno",
        "email",
    )
    search_fields = ("id","nombre", "apellido_paterno", "apellido_materno", "email")
    class Meta:
        model = UserAdminPanel


class UserAdminAdmin(ImportExportModelAdmin):
    pass
    list_display = (
        "id",
        "nombre",
        "apellido_paterno",
        "apellido_materno",
        "email",
    )
    search_fields = ("id","nombre", "apellido_paterno", "apellido_materno", "email")
    class Meta:
        model = UserAdmin


class VentasEstudiosAdmin(ImportExportModelAdmin):
    pass
    list_display = (
        "id",
        "empresa",
        "sucursal",
        "estudio",
        "numero_estudios",
        "liquidado",
        "tipo",
        "importe",
        "date",
    )
    search_fields = ("id","estudio","date")
    class Meta:
        model = VentaEstudios


class VentaDespartamentoAreaAdmin(ImportExportModelAdmin):
    pass
    list_display = (
        "id",
        "empresa",
        "sucursal",
        "departamento",
        "area",
        "numero_estudios",
        "liquidado",
        "tipo",
        "importe",
        "date",
    )
    search_fields = ("id","departamento", "sucursal", "date")
    class Meta:
        model = VentaDespartamentoArea


class CajeroOperadorAdmin(ImportExportModelAdmin):
    pass
    list_display = (
        "id",
        "cajero_empleado",
        'empresa',
        'sucursal',
        "hora_entrada",
        "hora_salida",
    )
    search_fields = ("id", "cajero")
    class Meta:
        model = CajeroOperador


class AperturaCierreCajaAdmin(ImportExportModelAdmin):
    pass
    list_display = (
        "id",
        "sucursal",
        "empresa",
        "cajero",
        "date",
        "hora_inicio",
        "monto_inicial",
        "hora_final",
        "monto_final",
    )
    search_fields = ("id", "empresa")
    class Meta:
        model = AperturaCierreCaja


class MovimientosAdmin(ImportExportModelAdmin):
    pass
    list_display = (
        "id",
        "folio",
        "numero_solicitudes",
        "tipo_pago",
        "convenio",
        "total",
        "apertura_cierre",
        "cajero",
    )
    search_fields = ("id", "sucursal", "date")
    class Meta:
        model = Movimientos


class DevolucionesAdmin(ImportExportModelAdmin):
    pass
    list_display = (
        "id",
        "empresa",
        "sucursal",
        "cajero",
        "tipo_devolucion",
        "total", 
        "date",
    )
    search_fields = ("id", "sucursal", "date")
    class Meta:
        model = Devoluciones


class ActivityLoginAdmin(ImportExportModelAdmin):
    pass
    list_display = (
        "id",
        "nombre",
        "apellido_paterno",
        "apellido_materno",
        "action",
        "date",
    )
    search_fields = ("id", "nombre", "apellido_paterno", "apellido_materno", "date")
    class Meta:
        model = ActivityLogin


class ActivityViewsAdmin(ImportExportModelAdmin):
    pass
    list_display = (
        "id",
        "nombre",
        "apellido_paterno",
        "apellido_materno",
        "consulta",
        "date",
    )
    search_fields = ("id", "nombre", "consulta", "date")
    class Meta:
        model = ActivityViews


admin.site.register(VentaEstudios, VentasEstudiosAdmin)
admin.site.register(VentaDespartamentoArea, VentaDespartamentoAreaAdmin)
admin.site.register(CajeroOperador, CajeroOperadorAdmin)
admin.site.register(AperturaCierreCaja, AperturaCierreCajaAdmin)
admin.site.register(Movimientos, MovimientosAdmin)
admin.site.register(Devoluciones, DevolucionesAdmin)
admin.site.register(UserAdminPanel, UserAdminPanelAdmin)
# admin.site.register(ActivityLogin, ActivityLoginAdmin)
# admin.site.register(ActivityViews, ActivityViewsAdmin)
admin.site.register(VentasTotal)
admin.site.register(UserAdmin, UserAdminAdmin)