from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.db.models.functions import Lower
from import_export.admin import ImportExportModelAdmin
from panel_radiologos.models import Imagenologia

from .models import *



# Define an inline admin descriptor for Employee model
# which acts a bit like a singleton
class EmployeeInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'profile'

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (EmployeeInline,)


class PacienteAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","nombre","apellido_paterno","apellido_materno", "email"]
    search_fields = ["id","nombre","apellido_paterno","apellido_materno", "email"]

    class Meta:
        model = Paciente


class TiempoServicioAdmin(admin.ModelAdmin):
    list_display = ["Sang","Esp","US","RXS","RXC","Masto","TACS","TACC","RMS","RMC","Densi","Card","Papa","Colpo","Audio","Espiro","Pato","Clinica", "RehaEle","RehaHid","RehaMec"]
    search_fields = ["Sang","Esp","US","RXS","RXC","Masto","TACS","TACC","RMS","RMC","Densi","Card","Papa","Colpo","Audio","Espiro","Pato","Clinica","RehaEle","RehaHid","RehaMec"]

    class Meta:
        model = TiempoServicio


class EmpleadoAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","puesto","nombre","apellido_paterno","apellido_materno"]
    search_fields = ["id","puesto","nombre","apellido_paterno","apellido_materno"]
    class Meta:
        model = Empleado


class JefeSucursalAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","nombre","apellido_paterno","apellido_materno"]
    search_fields = ["id","nombre","apellido_paterno","apellido_materno"]
    class Meta:
        model = JefeSucursal



class AlmacenistaAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","nombre","apellido_paterno","apellido_materno"]
    search_fields = ["id","nombre","apellido_paterno","apellido_materno"]
    class Meta:
        model = Almacenista


class MedicoAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","verificado","medicoSemin","especialidad","cedula","nombre","apellido_paterno","apellido_materno","telefono","email","estado","ranking","estrellas","caducidad"]
    search_fields = ["id","verificado","caducidad","especialidad","cedula","nombre","apellido_paterno","apellido_materno","telefono","estado","email"]
    class Meta:
        model = Medico


class AdministradorAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","puesto","nombre","apellido_paterno","apellido_materno"]
    search_fields = ["id","puesto","nombre","apellido_paterno","apellido_materno"]
    class Meta:
        model = Admin


class EstudioAdmin(admin.ModelAdmin): #front
    list_display = ["id","tipoEstudio", "Paciente__numExpediente", "Paciente__nombre", "Paciente__apellido_paterno", "Paciente__apellido_materno", "creacion", "ultimaActualizacion"]
    search_fields = ["id","tipoEstudio", "Paciente__numExpediente", "Paciente__nombre", "Paciente__apellido_paterno", "Paciente__apellido_materno", "creacion", "ultimaActualizacion"]

    def Paciente__numExpediente(self, instance):
        return instance.Paciente.numExpediente

    def Paciente__nombre(self, instance):
        return instance.Paciente.nombre

    def Paciente__apellido_paterno(self, instance):
        return instance.Paciente.apellido_paterno

    def Paciente__apellido_materno(self, instance):
        return instance.Paciente.apellido_materno

    class Meta:
        model = Estudio


class SucursalAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","nombreSucursal"]
    search_fields = ["id","nombreSucursal"]

    class Meta:
        model = Sucursal


class DisponibilidadServicioAdmin(ImportExportModelAdmin):
    pass
    list_display = ["Nombre__Sucursal","ultimaActualizacion", "Sang", "Esp", "US", "USD","RXS","RXC", "Masto", "TAC", "RM", "Densi", "Card", "Pato", "Colpo", "Audio", "Espiro"]
    search_fields = ["Nombre__Sucursal","ultimaActualizacion", "Sang", "Esp", "US", "USD","RXS","RXC", "Masto", "TAC", "RM", "Densi", "Card", "Pato", "Colpo", "Audio", "Espiro"]

    def get_ordering(self, request):
        return [Lower('Sucursal__nombreSucursal')]

    def Nombre__Sucursal(self, instance):
        return instance.Sucursal.nombreSucursal

    class Meta:
        model = DisponibilidadServicio

class CitaSucursalAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","fecha_cita", "hora_inicio" ,"hora_final", "prueba", "precioVenta", "estatus", "tipo_cita","Paciente__completo","creador","id_pago","tipo_pago","sucursal__nombreSucursal","creacion","app_movil","id_sala"]
    search_fields = ["id","fecha_cita", "hora_inicio" ,"hora_final", "prueba", "precioVenta", "estatus", "tipo_cita","id_pago","tipo_pago","creacion","creador","Paciente__nombre", "Paciente__apellido_paterno", "Paciente__apellido_materno","app_movil","id_sala"]

    def sucursal__nombreSucursal(self, instance):
        return instance.Sucursal.nombreSucursal

    def Paciente__completo(self, instance):
        return instance.Paciente

    def Paciente__nombre(self, instance):
        return instance.Paciente.nombre

    def Paciente__apellido_paterno(self, instance):
        return instance.Paciente.apellido_paterno

    def Paciente__apellido_materno(self, instance):
        return instance.Paciente.apellido_materno

    class Meta:
        model = CitaSucursal


class CitaMedicoAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","fecha_cita", "hora_inicio" ,"hora_final", "costo", "estatus", "tipo", "Medico__nombre", "Medico__apellido_paterno", "Medico__apellido_materno", "titulo"]
    search_fields = ["id","fecha_cita", "hora_inicio" ,"hora_final", "costo", "estatus", "tipo", "Medico__nombre", "Medico__apellido_paterno", "Medico__apellido_materno", "titulo"]

    def Medico__nombre(self, instance):
        return instance.Medico.nombre

    def Medico__apellido_paterno(self, instance):
        return instance.Medico.apellido_paterno

    def Medico__apellido_materno(self, instance):
        return instance.Medico.apellido_materno

    class Meta:
        model = CitaMedico


class FacturacionAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","factura_estatus","nombre","apellido_paterno","apellido_materno", "tipo_rfc", "rfc"]
    search_fields = ["id","factura_estatus","nombre","apellido_paterno","apellido_materno", "tipo_rfc", "rfc"]

    class Meta:
        model = Facturacion


class ComentariosAdmin(ImportExportModelAdmin):
    pass

    list_display = ["id","nombre_paciente","tipo_opinion","fecha","hora"]
    search_fields = ["id","nombre_paciente","tipo_opinion","fecha","hora"]

    class Meta:
        model = Comentarios


class QuejasSugerenciasAdmin(ImportExportModelAdmin):
    pass

    list_display = ["id","tipo", "tipo_recibo", "fecha_evento" , "hora_evento"]
    search_fields = ["id","tipo", "tipo_recibo", "fecha_evento" , "hora_evento"]

    class Meta:
        model = QuejasSugerencias



class CallCenterAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","telefono","nombre"]
    search_fields = ["id","telefono","nombre"]

    class Meta:
        model = CallCenter


class HistoricoPagoAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","creacion","Paciente__completo"]
    search_fields = ["id","creacion","Paciente__completo"]

    def Paciente__completo(self, instance):
        return instance.Paciente

    class Meta:
        model = HistoricoPago


class CatalogoAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","prueba", "area", "precioVenta", "ranking"]
    search_fields = ["id","prueba", "area", "precioVenta", "ranking"]

    class Meta:
        model = Catalogo


class CarrouselAdmin(admin.ModelAdmin):
    list_display = ["id","titulo","caducidad"]
    search_fields = ["id","titulo","caducidad"]

    class Meta:
        model = Carrousel


class PromocionAdmin(admin.ModelAdmin):
    list_display = ["id","titulo","precioVenta","caducidad"]
    search_fields = ["id","titulo","precioVenta","caducidad"]

    class Meta:
        model = Promocion


class PromocionTicketAdmin(admin.ModelAdmin):
    list_display = ["id","titulo","precioVenta","caducidad"]
    search_fields = ["id","titulo","precioVenta","caducidad"]

    class Meta:
        model = PromocionTicket


class Cie10Admin(ImportExportModelAdmin):
    list_display = ["LETRA", "CATALOG_KEY", "NOMBRE"]
    search_fields = ["LETRA", "CATALOG_KEY", "NOMBRE"]

    class Meta:
        model = Cie10


class PrimeraEncuestasAdmin(ImportExportModelAdmin):
    list_display = ["preguntaUno", "preguntaDos", "preguntaTres"]
    search_fields =  ["preguntaUno", "preguntaDos", "preguntaTres"]
    class Meta:
        model = PrimeraEncuesta


class HistoriaClinicaAdmin(ImportExportModelAdmin):
    
    class Meta:
        model = HistoriaClinica


class ConsultaAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","Paciente__nombre", "Paciente__apellido_paterno", "Paciente__apellido_materno", "creacion", "ultimaActualizacion"]
    search_fields = ["id","Paciente__nombre", "Paciente__apellido_paterno", "Paciente__apellido_materno", "creacion", "ultimaActualizacion"]

    def Paciente__nombre(self, instance):
        return instance.Paciente.nombre

    def Paciente__apellido_paterno(self, instance):
        return instance.Paciente.apellido_paterno

    def Paciente__apellido_materno(self, instance):
        return instance.Paciente.apellido_materno

    class Meta:
        model = Consulta


class TablaPermisosAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","Paciente__nombre", "Paciente__apellido_paterno", "Paciente__apellido_materno",  "caducidad", "tipo","estatus"]
    search_fields = ["id","Paciente__nombre", "Paciente__apellido_paterno", "Paciente__apellido_materno", "caducidad", "tipo", "estatus"]

    def Paciente__nombre(self, instance):
        return instance.Paciente.nombre

    def Paciente__apellido_paterno(self, instance):
        return instance.Paciente.apellido_paterno

    def Paciente__apellido_materno(self, instance):
        return instance.Paciente.apellido_materno

    class Meta:
        model = TablaPermisos


class CorreoAdmin(ImportExportModelAdmin):
    pass
    list_display = ("id","nombre","email")
    search_fields = ("id","nombre","email")
    class Meta:
        model = Correo


class ConsultasClientesAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","consulta", "creacion"]
    search_fields =  ["id","consulta", "creacion"]
    class Meta:
        model = ConsultasClientes


class EstudioEmpresaAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","nombreEstudio", "categoria","Paciente","Empresa","fecha_realizacion","creacion"]
    search_fields  = ["id","nombreEstudio", "categoria","Paciente","Empresa","fecha_realizacion","creacion"]

    class Meta:
        model = EstudioEmpresa


class EmpresaAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","nombreEmpresa"]
    search_fields  = ["id","nombreEmpresa"]

    class Meta:
        model = Empresa


class LoginClientesAdmin(ImportExportModelAdmin):
    pass

    list_display = ["id","Paciente__nombre", "Paciente__apellido_paterno", "Paciente__apellido_materno", "Paciente__email",  "origen", "creacion"]
    search_fields = ["id","Paciente__nombre", "Paciente__apellido_paterno", "Paciente__apellido_materno", "Paciente__email",  "origen", "creacion"]

    def Paciente__nombre(self, instance):
        return instance.Paciente.nombre

    def Paciente__apellido_paterno(self, instance):
        return instance.Paciente.apellido_paterno

    def Paciente__apellido_materno(self, instance):
        return instance.Paciente.apellido_materno

    def Paciente__email(self, instance):
        return instance.Paciente.email

    class Meta:
        model = LoginClientes


class BolsaAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","titulo", "fecha_contratacion"]
    search_fields =  ["id","titulo", "fecha_contratacion"]
    class Meta:
        model = Bolsa



class RegistroVideollamadaAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","fecha_cita","hora_inicio","hora_final","Paciente__nombre", "Paciente__apellido_paterno", "Paciente__apellido_materno", "Medico__nombre", "Medico__apellido_paterno", "Medico__apellido_materno", "creacion", "ultimaActualizacion"]
    search_fields = ["id","fecha_cita","hora_inicio","hora_final","Paciente__nombre", "Paciente__apellido_paterno", "Paciente__apellido_materno", "Medico__nombre", "Medico__apellido_paterno", "Medico__apellido_materno", "creacion", "ultimaActualizacion"]

    def Paciente__nombre(self, instance):
        return instance.Paciente.nombre

    def Paciente__apellido_paterno(self, instance):
        return instance.Paciente.apellido_paterno

    def Paciente__apellido_materno(self, instance):
        return instance.Paciente.apellido_materno

    def Medico__nombre(self, instance):
        return instance.Medico.nombre

    def Medico__apellido_paterno(self, instance):
        return instance.Medico.apellido_paterno

    def Medico__apellido_materno(self, instance):
        return instance.Medico.apellido_materno

    class Meta:
        model = RegistroVideollamada


class VersionClienteAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","version", "tipo"]
    search_fields =  ["id","version", "tipo"]
    class Meta:
        model = VersionCliente


class FondoLoginAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","titulo"]
    search_fields =  ["id","titulo"]
    class Meta:
        model = FondoLogin
        
class ImagenologiaAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","nombre","apellido_paterno","apellido_materno","telefono","email"]
    search_fields = ["id","nombre","apellido_paterno","apellido_materno","telefono","email"]
    class Meta:
        model = Imagenologia


class RehabilitacionAdmin(ImportExportModelAdmin):
    pass
    list_display = ["id","nombre","apellido_paterno","apellido_materno","fecha_nacimiento", "status", "observaciones"]
    search_fields = ["id","nombre","apellido_paterno","apellido_materno"]
    class Meta:
        model = Rehabilitacion


class FisioterapeutaAdmin(ImportExportModelAdmin):
    pass
    list_display = ("id","nombre","apellido_paterno","apellido_materno","telefono","email")
    search_fields = ("id","nombre","apellido_paterno","apellido_materno")
    class Meta:
        model = Fisioterapeuta


class TemperaturasAdmin(ImportExportModelAdmin):
    pass
    list_display = ("id","temperatura","identificador")
    search_fields = ("id","identificador")
    class Meta:
        model = SensorTemperatura


class MensajeroAdmin(ImportExportModelAdmin):
    pass
    list_display = ("id","nombre","apellido_paterno","apellido_materno","telefono")
    search_fields = ("id","nombre","apellido_paterno","apellido_materno")
    class Meta:
        model = Mensajero

# admin 👇
class AreaAdmin(ImportExportModelAdmin):
    pass
    list_display = ("id", "nombre", "id_sucursal")
    search_fields = ("id","nombre")
    class Meta:
        model = Area


class ProveedorAdmin(ImportExportModelAdmin):
    pass
    list_display = (
        "id",
        "nombre_compañia",
        "nombre_contacto",
        "apellidoP_contacto",
        "apellidoM_contacto",
        "tipo_proveedor",
        "telefono",
    )
    search_fields = ("id","nombre_compañia","nombre_contacto","apellidoM_contacto","tipo_proveedor")
    class Meta:
        model = Proveedor


class ProductosAdmin(ImportExportModelAdmin):
    pass
    list_display = (
        "id",
        "nombre",
        "presentacion",
        "fecha_ingreso",
        "fecha_caducidad",
        "stok",
        "stok_max",
        "stok_min",
    )
    search_fields = ("id","nombre","presentacion","fecha_caducidad")
    class Meta:
        model = Productos


class DevolucionesAdmin(ImportExportModelAdmin):
    pass
    list_display = (
        "id",
        "id_produtos",
        "id_proveedores",
        "fecha_devolucion",
        "nota",
    )
    search_fields = ("id","nombre","presentacion","fecha_caducidad")
    class Meta:
        model = Devoluciones


class SolicitudAdmin(ImportExportModelAdmin):
    pass
    list_display = (
        "id",
        "id_sucursal",
        "id_empleado",
        "nombre",
        "nota",
    )
    search_fields = ("id","nombre")
    class Meta:
        model = Solicitud


class EnvioAdmin(ImportExportModelAdmin):
    pass
    list_display = (
        "id",
        "id_sucursal",
        "id_empleado",
        "id_producto",
        "fecha",
        "medio",
    )
    search_fields = ("id","fecha","medio")
    class Meta:
        model = Envio



admin.site.site_header = 'PANEL DE CONTROL SEMIN SERVER'
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Empleado, EmpleadoAdmin)
admin.site.register(Medico, MedicoAdmin)
admin.site.register(Admin, AdministradorAdmin)
admin.site.register(TiempoServicio, TiempoServicioAdmin)
admin.site.register(Facturacion, FacturacionAdmin)
admin.site.register(CallCenter, CallCenterAdmin)
admin.site.register(Paciente, PacienteAdmin)
admin.site.register(Estudio, EstudioAdmin)
admin.site.register(Sucursal, SucursalAdmin)
admin.site.register(DisponibilidadServicio, DisponibilidadServicioAdmin)
admin.site.register(CitaSucursal, CitaSucursalAdmin)
admin.site.register(Catalogo, CatalogoAdmin)
admin.site.register(Promocion, PromocionAdmin)
admin.site.register(PromocionTicket, PromocionTicketAdmin) 
admin.site.register(PrimeraEncuesta, PrimeraEncuestasAdmin)
admin.site.register(HistoriaClinica, HistoriaClinicaAdmin)
admin.site.register(Consulta, ConsultaAdmin)
admin.site.register(HistoricoPago, HistoricoPagoAdmin)
admin.site.register(TablaPermisos, TablaPermisosAdmin)
admin.site.register(CitaMedico, CitaMedicoAdmin)
admin.site.register(ConsultasClientes, ConsultasClientesAdmin)
admin.site.register(VersionCliente, VersionClienteAdmin)
admin.site.register(Cie10, Cie10Admin)
admin.site.register(Bolsa, BolsaAdmin)
admin.site.register(Comentarios, ComentariosAdmin)
admin.site.register(QuejasSugerencias, QuejasSugerenciasAdmin)
admin.site.register(Correo, CorreoAdmin)
admin.site.register(LoginClientes, LoginClientesAdmin)
admin.site.register(Imagenologia, ImagenologiaAdmin)
admin.site.register(EstudioEmpresa,EstudioEmpresaAdmin)
admin.site.register(Empresa,EmpresaAdmin)
admin.site.register(Carrousel,CarrouselAdmin)
admin.site.register(RegistroVideollamada,RegistroVideollamadaAdmin)
admin.site.register(FondoLogin,FondoLoginAdmin)
admin.site.register(Rehabilitacion,RehabilitacionAdmin)
admin.site.register(Fisioterapeuta,FisioterapeutaAdmin)
admin.site.register(Mensajero,MensajeroAdmin)
admin.site.register(SensorTemperatura,TemperaturasAdmin)
admin.site.register(Almacenista,AlmacenistaAdmin)
admin.site.register(JefeSucursal,JefeSucursalAdmin)


#tu admin inicia aqui 👇
admin.site.register(Proveedor,ProveedorAdmin)
admin.site.register(Productos,ProductosAdmin)
admin.site.register(Devoluciones,DevolucionesAdmin)
admin.site.register(Solicitud,SolicitudAdmin)
admin.site.register(Envio,EnvioAdmin)
admin.site.register(Area,AreaAdmin)
