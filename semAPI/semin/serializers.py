from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from panel_radiologos.models import EstudioDicom, ActualizacionEstudioDicom, Imagenologia


class  EmpleadoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Empleado
        fields = "__all__"


class  AlmacenistaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Almacenista
        fields = "__all__"


class  JefeSucursalSerializer(serializers.ModelSerializer):

    class Meta:
        model = JefeSucursal
        fields = "__all__"


class  PagoOpenPaySerializer(serializers.ModelSerializer):

    class Meta:
        model = PagoOpenPay
        fields = "__all__"


class  VersionClienteSerializer(serializers.ModelSerializer):

    class Meta:
        model = VersionCliente
        fields = "__all__"


class  FondoLoginSerializer(serializers.ModelSerializer):

    class Meta:
        model = FondoLogin
        fields = "__all__"


class  MedicoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Medico
        fields = "__all__"


class  MedicoSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = Medico
        fields = ('id','nombre','apellido_paterno','apellido_materno','imagen','especialidad','estado','estrellas','estrellasArray','estatusConexion','room',"cedula")


class  MedicoNameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Medico
        fields = ('id','nombre','apellido_paterno','apellido_materno', 'email')


class  AdminSerializer(serializers.ModelSerializer):

    class Meta:
        model = Admin
        fields = "__all__"

class  CallCenterSerializer(serializers.ModelSerializer):

    class Meta:
        model = CallCenter
        fields = "__all__"

class  CitaMedicoSerializer(serializers.ModelSerializer):

    class Meta:
        model = CitaMedico
        fields = "__all__"


class  CitaMedicoAllSerializer(serializers.ModelSerializer):
    Medico = MedicoNameSerializer(required=False)

    class Meta:
        model = CitaMedico
        fields = "__all__"



class  CitaMedicoSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = CitaMedico
        fields = ('id','fecha_cita','hora_inicio','hora_final')


class  CitaSucursalSerializer(serializers.ModelSerializer):

    class Meta:
        model = CitaSucursal
        fields = "__all__"


class  CitaSucursalSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = CitaSucursal
        fields = ('id','fecha_cita','hora_inicio','hora_final','estatus','prueba','tipo_cita')

class  FacturacionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Facturacion
        fields = "__all__"


class  ComentariosSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comentarios
        fields = "__all__"


class  ComentariosMinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comentarios
        fields = ('id','nombre_paciente','tipo_opinion','fecha','hora')


class  QuejasSugerenciasSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuejasSugerencias
        fields = "__all__"


class  QuejasSugerenciasMinSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuejasSugerencias
        fields = ('id','nombre_presentante','tipo','tipo_recibo','fecha_evento','hora_evento')


class  TiempoServicioSerializer(serializers.ModelSerializer):

    class Meta:
        model = TiempoServicio
        fields = "__all__"
 

class PacienteSerializer(serializers.ModelSerializer):  

    class Meta:
        model = Paciente
        fields = ('id','nombre','apellido_paterno','apellido_materno','imagen','sexo','fecha_nacimiento','tipo_sangre','curp','entidad_nacimiento','entidad','nivel_socioeconomico','tipo_vivienda','discapacidad','grupoEtnico','religion','ocupacion','tipoDomicilio','calle','colonia','num_interior','num_exterior','cp','municipio','localidad','estado','telefonoCasa','telefonoOficina','telefonoCelular','email', 'numExpediente', 'fecha_registro','landing', 'promocion_registro','monedero')


class PacienteSearchRegisterSerializer(serializers.ModelSerializer):  

    class Meta:
        model = Paciente
        fields = ('id','email')


class EstudioEmpresaSearchSerializer(serializers.ModelSerializer):  

    class Meta:
        model = EstudioEmpresa
        fields = ('id','usuario')


class PacienteSearchSerializer(serializers.ModelSerializer):  

    class Meta:
        model = Paciente
        fields = ('id','nombre','apellido_paterno','apellido_materno','numExpediente','sexo','fecha_nacimiento','telefonoCelular','email')


class  CitaSucursalPacienteSerializer(serializers.ModelSerializer):
    Paciente = PacienteSerializer(required=False)

    class Meta:
        model = CitaSucursal
        fields = "__all__"


class  BolsaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Bolsa
        fields = "__all__"


class  RegistroVideollamadaSerializer(serializers.ModelSerializer):

    class Meta:
        model = RegistroVideollamada
        fields = "__all__"


class EstudioSerializer(serializers.ModelSerializer):

    class Meta:
        model = Estudio
        fields = "__all__"


class SucursalSerializer(serializers.ModelSerializer):

    class Meta:
        model = Sucursal
        fields = "__all__"


class DisponibilidadServicioSerializer(serializers.ModelSerializer):
    Sucursal = SucursalSerializer(required=False)

    class Meta:
        model = DisponibilidadServicio
        fields = "__all__"


class SucursalNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = ('id', 'nombreSucursal')




class CatalogoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Catalogo
        fields = "__all__"


class ConsultasClientesSerializer(serializers.ModelSerializer):

    class Meta:
        model = ConsultasClientes
        fields = "__all__"


class LoginClientesSerializer(serializers.ModelSerializer):

    class Meta:
        model = LoginClientes
        fields = "__all__"

class  PromocionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Promocion
        fields = ('id','titulo','descripcion','indicaciones','precioVenta','imagen','sexo', 'estudioInicial','Catalogo')



class  PromocionTicketSerializer(serializers.ModelSerializer):

    class Meta:
        model = PromocionTicket
        fields = ('id','titulo','prueba','descripcion','indicaciones','precioVenta','imagen','sexo', 'estudioInicial','caducidad','numVentas','Catalogo')



class UserSerializer(serializers.ModelSerializer):
    paciente = serializers.PrimaryKeyRelatedField(many=True, queryset=Paciente.objects.all())

    class Meta:
        model = User
        fields = "__all__"
#        fields = ('id', 'username', 'email', 'id_sem', 'tipo', 'titulo')


class ProfileSerializer(serializers.ModelSerializer):
#    user = UserSerializer(required=False)
    class Meta:
        model = Profile
        fields = ('id_sem', 'tipo')


class  CitaSucursalNameSerializer(serializers.ModelSerializer):
    Sucursal = SucursalNameSerializer(required=False)

    class Meta:
        model = CitaSucursal
        fields = ('id','fecha_cita','hora_inicio','hora_final','tipo_cita','id_sala','prueba','categoria','precioVenta','notas','estatus','id_pago','promocion','nombre_promocion','estatus_rembolso','razon_rembolso','Paciente','costoSucursal','creacion','Sucursal')



class Cie10Serializer(serializers.ModelSerializer):

    class Meta:
        model = Cie10
        fields = ('LETRA','CATALOG_KEY','NOMBRE')


class PrimeraEncuestaSerializer(serializers.ModelSerializer):

    class Meta:
        model = PrimeraEncuesta
        fields = "__all__"


class HistoriaClinicaSerializer(serializers.ModelSerializer):

    class Meta:
        model = HistoriaClinica
        fields = "__all__"


class ConsultaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Consulta
        fields = "__all__"


class TablaPermisosSerializer(serializers.ModelSerializer):

    class Meta:
        model = TablaPermisos
        fields = "__all__"


class TablaPermisosPacSerializer(serializers.ModelSerializer):
    Paciente = PacienteSerializer(required=False)

    class Meta:
        model = TablaPermisos
        fields = "__all__"

class TablaPermisosMedSerializer(serializers.ModelSerializer):
    Medico = MedicoNameSerializer(required=False)

    class Meta:
        model = TablaPermisos
        fields = "__all__"


class  CitaMedicoPacienteSerializer(serializers.ModelSerializer):
    Paciente = PacienteSerializer(required=False)

    class Meta:
        model = CitaMedico
        fields = "__all__"


class  ConsultaMedicoAllSerializer(serializers.ModelSerializer):
    Medico = MedicoNameSerializer(required=False)

    class Meta:
        model = Consulta
        fields = "__all__"

class  HistoricoPagoSerializer(serializers.ModelSerializer):

    class Meta:
        model = HistoricoPago
        fields = "__all__"

class  EmpresaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Empresa
        fields = "__all__"

class  EstudioEmpresaSerializer(serializers.ModelSerializer):

    class Meta:
        model = EstudioEmpresa
        fields = "__all__"


class PacienteNameSerializer(serializers.ModelSerializer):  

    class Meta:
        model = Paciente
        fields = ('id','nombre','apellido_paterno','apellido_materno')


class  CarrouselSerializer(serializers.ModelSerializer):

    class Meta:
        model = Carrousel
        fields = "__all__"


class  CorreoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Correo
        fields = "__all__"


class  EmpresaNameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Empresa
        fields = ('id','nombreEmpresa')


class  EstudioEmpresaListSerializer(serializers.ModelSerializer):
    Paciente = PacienteNameSerializer(required=False)
    Empresa = EmpresaNameSerializer(required=False)

    class Meta:
        model = EstudioEmpresa
        fields = "__all__"
        fields = ('id','nombreEstudio','categoria','Paciente','Empresa','fecha_realizacion')


class  EstudioEmpresaDetailSerializer(serializers.ModelSerializer): 
    Paciente = PacienteNameSerializer(required=False)
    Empresa = EmpresaNameSerializer(required=False)

    class Meta:
        model = EstudioEmpresa
        fields = ('id','usuario','solicitud','file','caducidad','fecha_realizacion','categoria','nombreEstudio','Paciente','Empresa','creador','editor','creacion','ultimaActualizacion')


class  EstudioEmpresaSearchExternoSerializer(serializers.ModelSerializer): 
    Paciente = PacienteNameSerializer(required=False)

    class Meta:
        model = EstudioEmpresa
        fields = ('id','usuario','solicitud','file','caducidad','fecha_realizacion','nombreEstudio','Paciente')

        
class  EstudiosDicomSerializer(serializers.ModelSerializer):
    paciente_id = serializers.ReadOnlyField(source='paciente.id', read_only=True)
    nombre = serializers.ReadOnlyField(source='paciente.nombre', read_only=True)
    apellido_paterno = serializers.ReadOnlyField(source='paciente.apellido_paterno', read_only=True)
    apellido_materno = serializers.ReadOnlyField(source='paciente.apellido_materno', read_only=True)
    
    class Meta:
        model = EstudioDicom
        fields = (
            "id",
            "paciente_id", 
            "nombre", 
            "apellido_paterno",
            "apellido_materno",
            "directorio_paciente",
            "tipo_estudio",
            "interpretado",
            "liberado"
        )
        
class ActualizacionEstudioDicomSerializer(serializers.ModelSerializer):
    creacion = serializers.DateTimeField()
    nombre = serializers.ReadOnlyField(source='doctor.nombre', read_only=True)
    apellido_paterno = serializers.ReadOnlyField(source='doctor.apellido_paterno', read_only=True)
    apellido_materno = serializers.ReadOnlyField(source='doctor.apellido_materno', read_only=True)
    
    class Meta:
        model = ActualizacionEstudioDicom
        fields = (
            'nombre',
            'apellido_paterno',
            'apellido_materno',
            'accion',
            'creacion'
        )
        
class ImagenologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imagenologia
        fields = (
            'nombre',
            'apellido_paterno',
            'apellido_materno',
            'email',
            'water_mark'
        )
    

class RehabilitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rehabilitacion
        fields = (
            'id',
            'nombre',
            'apellido_paterno',
            'apellido_materno',
            'fecha_nacimiento',
            'sexo',
            'status',
            'hoja_430',
            'constancia_vigencia',
            'orden_trabajo',
            'identificacion',
            'carnet',
            'bitacora',
            'numero_firmas',
            'observaciones',
        )


class RehabilitacionMenorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rehabilitacion
        exclude = (
            'creacion',
            'ultima_actualizacion'
        )


class EditRehabilitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rehabilitacion
        fields = (
            'status',
            'numero_firmas',
            'observaciones',
        )


class FisioterapeutaSerialazer(serializers.ModelSerializer):
    class Meta:
        model = Fisioterapeuta
        fields = (
            'email',
        )


class MensajeroSerialazer(serializers.ModelSerializer):
    class Meta:
        model = Mensajero
        fields = (
            'nombre',
            'apellido_paterno',
            'apellido_maternio',
        )


class TemperaturaSensorSerialazer(serializers.ModelSerializer):
    mensajero = MensajeroSerialazer(many=True, read_only=True)
    class Meta:
        model = SensorTemperatura
        fields = (
            'temperatura',
            'mensajero',
        )

class EmpleadoPanelDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = (
            "id",
            "nombre",
            "apellido_paterno",
            "apellido_materno",
            "email",
            "puesto",
        )


# bodega 👇
class AreaSerialazer(serializers.ModelSerializer):
    sucursal = SucursalSerializer(many=True, read_only=True)
    class Meta:
        model = Area
        fields = "__all__"


class ProveedorSerialazer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = "__all__"


class ProductosSerialazer(serializers.ModelSerializer):
    proveedor = ProveedorSerialazer(many=True, read_only=True)
    sucursal = SucursalSerializer(many=True, read_only=True)
    class Meta:
        model = Productos
        exclude = (
            "creacion",
            "ultimaActualizacion"
        )


class DevolucionesSerialazer(serializers.ModelSerializer):
    productos = ProductosSerialazer(many=True, read_only=True)
    proveedor = ProveedorSerialazer(many=True, read_only=True)
    class Meta:
        model = Devoluciones
        fields = "__all__"


class SolicitudSerialazer(serializers.ModelSerializer):
    sucursal = SucursalSerializer(many=True, read_only=True)
    empleado = EmpleadoSerializer(many=True, read_only=True)
    class Meta:
        model = Solicitud
        fields = "__all__"


class EnvioSerialazer(serializers.ModelSerializer):
    sucursal = SucursalSerializer(many=True, read_only=True)
    empleado = EmpleadoSerializer(many=True, read_only=True)
    producto = ProductosSerialazer(many=True, read_only=True)
    class Meta:
        model = Envio
        fields = "__all__"
