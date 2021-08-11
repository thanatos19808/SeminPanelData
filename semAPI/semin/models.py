# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core.exceptions import ValidationError
from sortedm2m.fields import SortedManyToManyField
from django.core.validators import MaxValueValidator, MinValueValidator



APPOINTMENT_TYPE_CHOICES =(
    ('ABIERTA', 'ABIERTA'),
    ('AGENDADA', 'AGENDADA'),
    ('EXTERNA', 'EXTERNA'),
    ('RESTRINGIDA', 'RESTRINGIDA')
)

CALL_CHOICES =(
    ('CALIDAD', 'CALIDAD'),
    ('RECIBIDA', 'RECIBIDA'),
)


SI_NO_CHOICES =(
    ('SI', 'SI'),
    ('NO', 'NO'),
)

SOURCE_TYPE_CHOICES =(
    ('APP', 'APP'),
    ('WEB', 'WEB'),
    ('AGENDA', 'AGENDA'),
    ('BUSCADOR', 'BUSCADOR'),
)

LOGIN_CHOICES =(
    ('APP_VIDEO', 'APP_VIDEO'),
    ('APP_DOC', 'APP_DOC'),
    ('WEB', 'WEB'),
)

APPOINTMENT_MED_TYPE_CHOICES =(
    ('AGENDADA', 'AGENDADA'),
    ('VIRTUAL', 'VIRTUAL'),
)


PAY_CHOICES=(
    ('OPENPAY', 'OPENPAY'),
    ('PAYPAL', 'PAYPAL'),
    ('STRIPE', 'STRIPE'),
)


VERSIONS_CHOICES=(
    ('ANDROID_DS', 'ANDROID_DS'),
    ('IOS_DS', 'IOS_DS'),
    ('ANDROID_V', 'ANDROID_V'),
    ('IOS_V', 'IOS_V'),
)


SPECIALITY_CHOICES =(
    ('Medicina General', 'Medicina General'),
    ('Medicina Interna', 'Medicina Interna'),
    ('Cirugia', 'Cirugía'),
    ('Endocrinologia', 'Endocrinología'),
    ('Ginecologia', 'Ginecología'),
    ('Nefrologia', 'Nefrología'),
    ('Neurocirugia', 'Neurocirugía'),
    ('Neurologia', 'Neurología'),
    ('Pediatria', 'Pediatría'),
    ('Traumatologia y Ortopedia', 'Traumatología y Ortopedia'),
    ('Urologia', 'Urología')
)


ESTUDIO_CHOICES = (
    ('Analisis Sanguineos', 'Analisis Sanguineos'),
    ('Analisis Clinicos', 'Analisis Clinicos'),
    ('Ultrasonografia', 'Ultrasonografia'),
    ('Ultrasonografia Doppler', 'Ultrasonografia Doppler'),
    ('Rayos X', 'Rayos X'),
    ('Rayos X Contrastados', 'Rayos X Contrastados'),
    ('Mastografia', 'Mastografia'),
    ('Papanicolau', 'Papanicolau'),
    ('Tomografia', 'Tomografia'),
    ('Tomografia Contrastada', 'Tomografia Contrastada'),
    ('Resonancia Magnetica', 'Resonancia Magnetica'),
    ('Resonancia Magnetica Contrastada', 'Resonancia Magnetica Contrastada'),
    ('Colposcopia', 'Colposcopia'),
    ('Densitometria', 'Densitometria'),
    ('Audiologia', 'Audiologia'),
    ('Espirometria', 'Espirometria'),
    ('Patologia', 'Patologia'),
    ('Consulta', 'Consulta'),
    ('Ginecologia', 'Ginecologia'),
    ('Cardiologia', 'Cardiologia'),
    ('Cirugia', 'Cirugia'),
    ('Covid', 'Covid')
)

ESTUDIO_CHOICES_FOR_VIDEO = (
    ('Tomografia', 'Tomografia'),
    ('Tomografia Contrastada', 'Tomografia Contrastada'),
    ('Resonancia Magnetica', 'Resonancia Magnetica'),
    ('Resonancia Magnetica Contrastada', 'Resonancia Magnetica Contrastada')
)


SALA_ESTUDIO_CHOICES = (
    ('Sang', 'Sang'),
    ('Esp', 'Esp'),
    ('US', 'US'),
    ('USD', 'USD'),
    ('RXS', 'RXS'),
    ('RXC', 'RXC'),
    ('Masto', 'Masto'),
    ('TAC', 'TAC'),
    ('RM', 'RM'),
    ('Colpo', 'Colpo'),
    ('Densi', 'Densi'),
    ('Cli', 'Cli'),
    ('Card', 'Card'),
    ('Cons', 'Cons'),
    ('Externo', 'Externo')
)


SEXO_ESTUDIO_CHOICES = (
    ('M', 'M'),
    ('F','F'),
    ('I','I'),
)

USER_TYPE_CHOICES = (
    ('Paciente','Paciente'),
    ('Operador','Operador'),
    ('Imagenologia', 'Imagenologia'),
    ('Fisioterapeuta', 'Fisioterapeuta'),
    ('Almacenista','Almacenista'),
    ('Medico', 'Medico'),
    ('Administrador','Administrador'),
    ('Admin_panel','Admin_panel'),
    ('Auditor_panel','Auditor_panel'),
    ('administrador_editor','administrador_editor'),
    ('administrador_titular','administrador_titular'),
)


SEX_CHOICES = (
    ('masculino', 'masculino'),
    ('femenino','femenino'),
)

SEX_CHOICES_RH = (
    ('masculino', 'masculino'),
    ('femenino','femenino'),
    ('indistinto','indistinto'),
)

BLOOD_CHOICES = (
    ('N/A', 'No Definida'),
    ('A+', 'A Positiva'),
    ('A-', 'A Negativo'),
    ('B+', 'B Positivo'),
    ('B-', 'B Negativo'),
    ('O+', 'O Positivo'),
    ('O-', 'O Negativo'),
    ('AB+', 'AB Positivo'),
    ('AB-', 'AB Negativo'),
)

STATUS_CHOICES = (
    ('Activa', 'Activa'),
    ('Desactivada','Desactivada'),
    ('Des_pago','Desactivada_Pago'),
    ('Des_eliminada','Desactivada_Eliminada'),
    ('Des_inactiva','Desactivada_Inactiva'),
)

APPOINTMENT_STATUS_CHOICES = (
    ('ACTIVA','ACTIVA'),
    ('CERRADA','CERRADA'),
    ('CARRITO','CARRITO'),
    ('CANCELADA','CANCELADA'),
)

APPOINTMENT_MED_STATUS_CHOICES = (
    ('ACTIVA','ACTIVA'),
    ('CERRADA','CERRADA'),
    ('CANCELADA','CANCELADA'),
)


REMBOLSO_STATUS_CHOICES = (
    ('SOLICITADO','SOLICITADO'),
    ('APROBADO','APROBADO'),
    ('RECHAZADO','RECHAZADO')
)

FACTURACION_STATUS_CHOICES = (
    ('SOLICITADO','SOLICITADO'),
    ('CORREGIDO','CORREGIDO'),
    ('APROBADO','APROBADO'),
    ('RECHAZADO','RECHAZADO'),
    ('CANCELADO','CANCELADO')
)

RFC_CHOICES = (
    ('FISICA','FISICA'),
    ('MORAL','MORAL')
)


CFDI_CHOICES =(
    ('P01-Por definir','P01-Por definir'),
    ('G03-Gastos en general','G03-Gastos en general'),
    ('D01-Honorarios medicos dentales y gastos hospitalarios','D01-Honorarios medicos dentales y gastos hospitalarios')
)


MET_PAGO_CHOICES =(
    ('PDD-Pago en parcialidades o diferido','PDD-Pago en parcialidades o diferido'),
    ('PUE-Pago en una sola exhibición','PUE-Pago en una sola exhibición')
)


FORMA_PAGO_CHOICES =(
    ('01-Efectivo','01-Efectivo'),
    ('03-Transferencia electrónica de fondos','03-Transferencia electrónica de fondos'),
    ('04-Tarjeta de crédito','04-Tarjeta de crédito'),
    ('28-Tarjeta de debito','28-Tarjeta de debito'),
    ('99-Por definir','99-Por definir')
)


REMBOLSO_RAZON_CHOICES = (
    ('No pude hacer el estudio por no cumplir las condiciones requeridas','No pude hacer el estudio por no cumplir las condiciones requeridas'),
    ('Ya no requiero el estudio','Ya no requiero el estudio'),
    ('Requiero un cambio de estudio','Requiero un cambio de estudio'),
    ('No me gusto el servicio','No me gusto el servicio'),
    ('El personal no tiene buena actitud','El personal no tiene buena actitud'),
    ('Requiero un descuento adicional','Requiero un descuento adicional')
)

TITLE_CHOICES = (
    ('Dr.', 'Dr.'),
    ('Dra.','Dra.'),
)

STATE_CHOICES = (
    ('Aguascalientes','Aguascalientes'),
    ('Baja California','Baja California'),
    ('Baja California Sur','Baja California Sur'),
    ('Campeche','Campeche'),
    ('CDMX','CDMX'),
    ('Chihuahua','Chihuahua'),
    ('Chiapas','Chiapas'),
    ('Coahuila','Coahuila'),    
    ('Colima','Colima'),
    ('Durango','Durango'),
    ('Guanajuato','Guanajuato'),
    ('Guerrero','Guerrero'),
    ('Hidalgo','Hidalgo'),
    ('Jalisco','Jalisco'),
    ('México','México'),
    ('Michoacán','Michoacán'),
    ('Morelos','Morelos'),
    ('Nayarit','Nayarit'),
    ('Nuevo León','Nuevo León'),
    ('Oaxaca','Oaxaca'),
    ('Puebla','Puebla'),
    ('Querétaro','Querétaro'),
    ('Quintana Ro','Quintana Ro'),
    ('San Luis Potosí','San Luis Potosí'),
    ('Sinaloa','Sinaloa'),
    ('Sonora','Sonora'),
    ('Tabasco','Tabasco'),
    ('Tamaulipas','Tamaulipas'),
    ('Tlaxcala','Tlaxcala'),
    ('Veracruz','Veracruz'),
    ('Yucatán','Yucatán'),
    ('Zacatecas','Zacatecas'),
)

STATE_CONNECTION_CHOICES = (
    ('ACTIVO', 'ACTIVO'),
    ('INACTIVO', 'INACTIVO'),
)


DAY_CHOICES = (
    ('1', 'Lun'),
    ('2', 'Mar'),
    ('3', 'Mie'),
    ('4', 'Jue'),
    ('5', 'Vie'),
    ('6', 'Sab'),
    ('7', 'Dom'),
)

USER_EXPERIENCE = (
    ('1', '1'),
    ('2', '2'),
    ('3', '3'),
    ('4', '4'),
    ('5', '5'),
    ('6', '6'),
    ('7', '7'),
    ('8', '8'),
    ('9', '9'),
    ('10', '10'),
)

CORRECT_INFORMATION = (
    ('Sí', 'Sí'),
    ('No', 'No')
)

ESTUDIO_CHOICES_ENCUESTAS = (
    ('Analisis Sanguineos', 'Analisis Sanguineos'),
    ('Analisis Clinicos', 'Analisis Clinicos'),
    ('Ultrasonografia', 'Ultrasonografia'),
    ('Ultrasonografia Doppler', 'Ultrasonografia Doppler'),
    ('Rayos X', 'Rayos X'),
    ('Rayos X Contrastados', 'Rayos X Contrastados'),
    ('Mastografia', 'Mastografia'),
    ('Papanicolau', 'Papanicolau'),
    ('Tomografia', 'Tomografia'),
    ('Tomografia Contrastada', 'Tomografia Contrastada'),
    ('Resonancia Magnetica', 'Resonancia Magnetica'),
    ('Resonancia Magnetica Contrastada', 'Resonancia Magnetica Contrastada'),
    ('Colposcopia', 'Colposcopia'),
    ('Densitometria', 'Densitometria'),
    ('Audiologia', 'Audiologia'),
    ('Espirometria', 'Espirometria'),
    ('Patologia', 'Patologia'),
    ('Consulta', 'Consulta'),
    ('Cardiologia', 'Cardiologia'),
    ('Rehabilitacion', 'Rehabilitacion'),
    ('Otro', 'Otro'),
)

ESTADO_CIVIL_CHOICES = (
    ('Soltero', 'Soltero'),
    ('Casado', 'Casado'),
    ('Concubinato', 'Concubinato'),
    ('Viudo', 'Viudo'),
    ('Divorciado', 'Divorciado'),
    ('Separado', 'Separado')
)

INTERROGATION_CHOICES =(
    ('DIRECTO', 'DIRECTO'),
    ('INDIRECTO', 'INDIRECTO'),
    ('MIXTO', 'MIXTO'),
)

PERMISO_CHOICES =(
    ('INTERNO', 'INTERNO'),
    ('EXTERNO', 'EXTERNO')
)

PERMISO_ESTATUS_CHOICES =(
    ('ACTIVO', 'ACTIVO'),
    ('INACTIVO', 'INACTIVO')
)


VERIFICATION_CHOICES =(
    ('PENDIENTE', 'PENDIENTE'),
    ('APROBADO', 'APROBADO'),
    ('RECHAZADO', 'RECHAZADO'),
)


COMO_ENTERO_CHOICES =(
    ('Anuncio en la calle', 'Anuncio en la calle'),
    ('Volantes/Folletos', 'Volantes/Folletos'),
    ('Internet', 'Internet'),
    ('Recomendacion', 'Recomendacion'),
)


TIPO_OPINION_CHOICES =( 
    ('Queja', 'Queja'),
    ('Felicitaciones', 'Felicitaciones'),
    ('Comentarios', 'Comentarios'),
)


QUEJA_SUGERENCIA_TIPO_CHOICES =(
    ('Queja Interna', 'Queja Interna'),
    ('Queja Externa', 'Queja Externa'),
    ('Sugerencia', 'Sugerencia'),
)


RECIBO_TIPO_CHOICES =(
    ('Telefono', 'Telefono'),
    ('Presencial', 'Presencial'),
    ('Email', 'Email'),
    ('Redes Sociales', 'Redes Sociales'),
    ('Pagina web', 'Pagina web'),
    ('En Linea', 'En Linea'),
)

STATUS_EXPEDIENTE_REHABILITACION_CHOICES=(
    ('Correcto', 'Correcto'),
    ('Incorrecto', 'Incorrecto'),
    ('Pendiente', 'Pendiente'),
)

TIPO_PRESENTACION_CHOISE=(
    ('pieza','pieza'),
    ('litros','litros'),
    ('paquete','paquete'),
    ('caja','caja'),
    ('kilo','kilo'),
)

TIPO_PROVEEDOR_CHOISE=(
    ('primario','primario'),
    ('secundario','secundario'),
    ('otro','otro'),
)

UBICACION_PRODUCTO_CHOISE=(
    ('toma de muestra','toma de muestra'),
    ('estudio ginecologico','estudio ginecologico'),
    ('imagenologia','imagenologia'),
    ('intendencia','intendencia'),
    ('papeleria','papeleria'),
    ('laboratorio','laboratorio'),
)

CORPORATE_PANEL_PERMITS_CHOISE=(
    ('all','all'),
)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id_sem = models.IntegerField(null=True, blank=True)
    tipo = models.CharField(max_length=14,null=True, blank=True, choices=USER_TYPE_CHOICES)

    class Meta:
        verbose_name = _("Perfil")
        verbose_name_plural = _("Perfiles")
        ordering = ("user",)

    def __str__(self):
        return self.user.username
 
class Admin(models.Model):
    nombre = models.CharField(max_length=90,null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45,null=True, blank=False)
    apellido_materno = models.CharField(max_length=45,null=True, blank=True)
    puesto = models.CharField(max_length=90,null=True, blank=False)
    sexo = models.CharField(max_length=9,null=True, blank=True, choices=SEX_CHOICES)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    telefono = models.IntegerField(null=True, blank=True)
    email = models.EmailField(max_length=45, unique=True ,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s %s %s' % (self.nombre, self.apellido_paterno, self.apellido_materno)

    class Meta:
        verbose_name_plural = "Semin - Administradores"


class Medico(models.Model):
    medicoSemin = models.BooleanField(default=False, null=False, blank=True)
    verificado = models.CharField(default="PENDIENTE", max_length=11,null=True, blank=False, choices=VERIFICATION_CHOICES) 
    nombre = models.CharField(max_length=90,null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45,null=True, blank=False)
    apellido_materno = models.CharField(max_length=45,null=True, blank=True)
    imagen = models.ImageField(upload_to='images/doctores', null=True, blank=True)
    cedula = models.CharField(max_length=10,null=True, blank=True)
    especialidad = models.CharField(max_length=30,null=True, blank=False, choices=SPECIALITY_CHOICES)
    subespecialidad = models.CharField(max_length=200,null=True, blank=True)
    estado = models.CharField(max_length=20,null=True, blank=False, choices=STATE_CHOICES)
    estatusConexion = models.CharField(max_length=10,null=True, blank=True, choices=STATE_CONNECTION_CHOICES)
    ultimaConexion = models.DateTimeField(null=True, blank=True) 
    room = models.CharField(max_length=60,null=True, blank=True)
    ranking = models.IntegerField(default=500, null=True, blank=False)
    estrellas = models.IntegerField(default=5, null=True, blank=False)
    estrellasArray = models.CharField(max_length=100,null=True, blank=True)
    caducidad = models.DateField(null=True, blank=False)
    sexo = models.CharField(max_length=9,null=True, blank=True, choices=SEX_CHOICES)
    fecha_nacimiento = models.DateField(null=True, blank=False)
    fecha_registro = models.DateField(null=True, blank=True)
    telefono = models.IntegerField(null=True, blank=False)
    calle = models.CharField(max_length=90, null=True, blank=True)
    colonia = models.CharField(max_length=45,null=True, blank=True)
    num_interior = models.CharField(max_length=10,null=True, blank=True)
    num_exterior = models.CharField(max_length=10,null=True, blank=True)
    cp = models.CharField(max_length=5,null=True, blank=True)
    municipio = models.CharField(max_length=45,null=True, blank=True)
    localidad = models.CharField(max_length=200,null=True, blank=True)
    hora_apertura = models.TimeField(null=True, blank=False)
    hora_cierre = models.TimeField(null=True, blank=False)
    hora_apertura_sab = models.TimeField(null=True, blank=False)
    hora_cierre_sab = models.TimeField(null=True, blank=False)
    hora_apertura_dom = models.TimeField(null=True, blank=False)
    hora_cierre_dom = models.TimeField(null=True, blank=False)
    id_zoom = models.EmailField(max_length=45, null=True, blank=True)
    id_room_zoom = models.CharField(max_length=45,null=True, blank=True)
    token_zoom = models.CharField(max_length=200,null=True, blank=True)
    descripcion = models.CharField(max_length=1000,null=True, blank=True)
    email = models.EmailField(max_length=45, unique=True ,null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s %s %s' % (self.nombre, self.apellido_paterno, self.apellido_materno)

    class Meta:
        verbose_name_plural = "Semin - Medicos"


class Almacenista(models.Model):
    nombre = models.CharField(max_length=90,null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45,null=True, blank=False)
    apellido_materno = models.CharField(max_length=45,null=True, blank=True)
    sexo = models.CharField(max_length=9,null=True, blank=True, choices=SEX_CHOICES)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    telefono = models.IntegerField(null=True, blank=True)
    email = models.EmailField(max_length=45, unique=True ,null=True, blank=True)
    editors = models.ManyToManyField('auth.User', related_name='almacenista', blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s %s %s' % (self.nombre, self.apellido_paterno, self.apellido_materno)

    class Meta:
        verbose_name_plural = "Semin - Almacenista"


class JefeSucursal(models.Model):
    nombre = models.CharField(max_length=90,null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45,null=True, blank=False)
    apellido_materno = models.CharField(max_length=45,null=True, blank=True)
    sexo = models.CharField(max_length=9,null=True, blank=True, choices=SEX_CHOICES)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    telefono = models.IntegerField(null=True, blank=True)
    email = models.EmailField(max_length=45, unique=True ,null=True, blank=True)
    editors = models.ManyToManyField('auth.User', related_name='jefeSucursal', blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s %s %s' % (self.nombre, self.apellido_paterno, self.apellido_materno)

    class Meta:
        verbose_name_plural = "Semin - JefeSucursal"


class Empleado(models.Model):
    nombre = models.CharField(max_length=90,null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45,null=True, blank=False)
    apellido_materno = models.CharField(max_length=45,null=True, blank=True)
    auditor = models.BooleanField(default=False,null=True, blank=True)
    directivo = models.BooleanField(default=False,null=True, blank=True)
    puesto = models.CharField(max_length=90,null=True, blank=False)
    sexo = models.CharField(max_length=9,null=True, blank=True, choices=SEX_CHOICES)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    telefono = models.IntegerField(null=True, blank=True)
    email = models.EmailField(max_length=45, unique=True ,null=True, blank=True)
    editors = models.ManyToManyField('auth.User', related_name='operadores', blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s %s %s' % (self.nombre, self.apellido_paterno, self.apellido_materno)

    class Meta:
        verbose_name_plural = "Semin - Empleados"

class Paciente(models.Model):
    nombre = models.CharField(max_length=90,null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45,null=True, blank=False)
    apellido_materno = models.CharField(max_length=45,null=True, blank=True)
    imagen = models.ImageField(upload_to='images/pacientes', null=True, blank=True)
    numExpediente = models.IntegerField(null=True, blank=True,  unique=True)
    sexo = models.CharField(max_length=9,null=True, blank=True, choices=SEX_CHOICES)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    tipo_sangre = models.CharField(max_length=3,null=True, blank=True, choices=BLOOD_CHOICES)
    curp = models.CharField(max_length=18, unique=True ,null=True, blank=True)
    entidad_nacimiento = models.CharField(max_length=20,null=True, blank=True, choices=STATE_CHOICES)
    entidad = models.CharField(max_length=20,null=True, blank=True, choices=STATE_CHOICES)
    nivel_socioeconomico= models.CharField(max_length=90 ,null=True, blank=True)
    tipo_vivienda= models.CharField(max_length=200 ,null=True, blank=True)
    discapacidad= models.CharField(max_length=90 ,null=True, blank=True)
    grupoEtnico= models.CharField(max_length=90 ,null=True, blank=True)
    religion= models.CharField(max_length=45 ,null=True, blank=True)
    ocupacion= models.CharField(max_length=90 ,null=True, blank=True)
    tipoDomicilio= models.CharField(max_length=90 ,null=True, blank=True)
    calle = models.CharField(max_length=90, null=True, blank=True)
    colonia = models.CharField(max_length=45,null=True, blank=True)
    num_interior = models.CharField(max_length=10,null=True, blank=True)
    num_exterior = models.CharField(max_length=10,null=True, blank=True)
    cp = models.CharField(max_length=5,null=True, blank=True)
    municipio = models.CharField(max_length=45,null=True, blank=True)
    localidad = models.CharField(max_length=200,null=True, blank=True)
    estado = models.CharField(max_length=20,null=True, blank=True, choices=STATE_CHOICES)
    telefonoCasa = models.IntegerField(null=True, blank=True)
    telefonoOficina = models.IntegerField(null=True, blank=True)
    telefonoCelular = models.IntegerField(null=True, blank=True)
    email = models.EmailField(max_length=45, unique=True ,null=True, blank=False)
    fecha_registro = models.DateField(null=True, blank=True)
    maxGradoEstudios = models.CharField(max_length=50,null=True, blank=True)
    hijos = models.BooleanField(null=True, blank=True)
    numHijos = models.IntegerField(null=True, blank=True)
    estadoCivil = models.CharField(max_length=12,null=True, blank=True,  choices=ESTADO_CIVIL_CHOICES)
    landing = models.CharField(max_length=200,null=True, blank=True)
    promocion_registro = models.CharField(max_length=50 ,null=True, blank=True)
    monedero = models.IntegerField(null=True, blank=True,default=0) 
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update
    editors = models.ManyToManyField('auth.User', related_name='pacientes', blank=True)

    def __str__(self):
        return '%s %s %s' % (self.nombre, self.apellido_paterno, self.apellido_materno)

    class Meta:
        verbose_name_plural = "Pacientes"


class Estudio(models.Model):

    def validate_file(fieldfile_obj):
        filesize = fieldfile_obj.size
        megabyte_limit = 70.0
        if filesize > megabyte_limit*1024*1024:
            raise ValidationError("Max file size is %sMB" % str(megabyte_limit))

    def validate_file_dicom(fieldfile_obj):
        filesize = fieldfile_obj.size
        megabyte_limit = 70.0
        if filesize > megabyte_limit*1024*1024:
            raise ValidationError("Max file size is %sMB" % str(megabyte_limit))

    tipoEstudio = models.CharField(max_length=90, null=True, blank=False)
    notasEstudio = models.CharField(max_length=500, null=True, blank=True)
    fecha_realizacion = models.DateField(null=True, blank=False)
    file = models.FileField(upload_to='estudios/', validators=[validate_file], blank=False, null=True)
    fileDicom = models.FileField(upload_to='estudios/', validators=[validate_file_dicom], blank=True, null=True)
    Paciente = models.ForeignKey(Paciente, null=True, blank=False, on_delete=models.CASCADE)
    creador = models.CharField(max_length=90,null=True, blank=True)
    editor = models.CharField(max_length=90,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update


    def __str__(self):
        return '%s %s %s %s %s' % (self.creacion, self.tipoEstudio, self.Paciente.nombre, self.Paciente.apellido_paterno, self.Paciente.apellido_materno)

    class Meta:
        verbose_name_plural = "Pacientes - Estudios"


class Sucursal(models.Model):
    nombreSucursal = models.CharField(max_length=90,null=True, blank=False)
    hora_apertura = models.TimeField(null=True, blank=False)
    hora_cierre = models.TimeField(null=True, blank=False)
    hora_apertura_sab = models.TimeField(null=True, blank=False)
    hora_cierre_sab = models.TimeField(null=True, blank=False)
    latitud = models.FloatField(null=True, blank=True)
    longitud = models.FloatField(null=True, blank=True)
    descripcion = models.CharField(max_length=200,null=True, blank=True)
    calle = models.CharField(max_length=90, null=True, blank=True)
    colonia = models.CharField(max_length=45,null=True, blank=True)
    num_interior = models.CharField(max_length=10,null=True, blank=True)
    num_exterior = models.CharField(max_length=10,null=True, blank=True)
    cp = models.CharField(max_length=5,null=True, blank=True)
    municipio = models.CharField(max_length=45,null=True, blank=True)
    localidad = models.CharField(max_length=200,null=True, blank=True)
    estado = models.CharField(max_length=20,null=True, blank=True, choices=STATE_CHOICES)
    telefono = models.IntegerField(null=True, blank=True)
    estacionamiento = models.BooleanField(default=False,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s' % (self.nombreSucursal)

    class Meta:
        verbose_name_plural = "Semin - Sucursales"


class TiempoServicio(models.Model): 
    Sang = models.IntegerField(default=0,null=False,blank=False)
    Esp = models.IntegerField(default=0,null=False,blank=False)
    US = models.IntegerField(default=0,null=False,blank=False)
    USD = models.IntegerField(default=0,null=False,blank=False)
    RXS = models.IntegerField(default=0,null=False,blank=False)
    RXC = models.IntegerField(default=0,null=False,blank=False)
    Masto = models.IntegerField(default=0,null=False,blank=False)
    TACS = models.IntegerField(default=0,null=False,blank=False)
    TACC = models.IntegerField(default=0,null=False,blank=False)
    RMS = models.IntegerField(default=0,null=False,blank=False)
    RMC = models.IntegerField(default=0,null=False,blank=False)
    Densi = models.IntegerField(default=0,null=False,blank=False)
    Card = models.IntegerField(default=0,null=False,blank=False)
    Papa = models.IntegerField(default=0,null=False,blank=False)
    Colpo = models.IntegerField(default=0,null=False,blank=False)
    Clinica = models.IntegerField(default=0,null=False,blank=False)
    Audio = models.IntegerField(default=0,null=False,blank=False)
    Espiro = models.IntegerField(default=0,null=False,blank=False)
    Pato = models.IntegerField(default=0,null=False,blank=False)
    Cons = models.IntegerField(default=0,null=False,blank=False)
    RehaEle = models.IntegerField(default=0,null=False, blank=False)
    RehaHid = models.IntegerField(default=0,null=False, blank=False)
    RehaMec = models.IntegerField(default=0,null=False, blank=False)

    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s' % (self.Sang, self.Esp, self.US, self.RXS, self.RXC, self.Masto, self.TACS, self.TACC, self.RMS, self.RMC, self.Densi, self.Card, self.Papa, self.Colpo, self.Audio, self.Espiro, self.Pato, self.Clinica, self.RehaEle, self.RehaHid, self.RehaMec)

    class Meta:
        verbose_name_plural = "Semin - Tiempo de Servicio "


class DisponibilidadServicio(models.Model):
    Sang = models.IntegerField(default=0,null=False, blank=False)
    Esp = models.IntegerField(default=0,null=False, blank=False)
    US = models.IntegerField(default=0,null=False, blank=False)
    USD = models.IntegerField(default=0,null=False, blank=False)
    RXS = models.IntegerField(default=0,null=False, blank=False)
    RXC = models.IntegerField(default=0,null=False, blank=False)
    Masto = models.IntegerField(default=0,null=False, blank=False)
    TAC = models.IntegerField(default=0,null=False, blank=False)
    RM = models.IntegerField(default=0,null=False, blank=False)
    Densi = models.IntegerField(default=0,null=False, blank=False)
    Card = models.IntegerField(default=0,null=False, blank=False)
    Pato = models.IntegerField(default=0,null=False, blank=False)
    Colpo = models.IntegerField(default=0,null=False, blank=False)
    Audio = models.IntegerField(default=0,null=False, blank=False)
    Espiro = models.IntegerField(default=0,null=False, blank=False)
    Cons1 = models.IntegerField(default=0,null=False, blank=False)
    Cons2 = models.IntegerField(default=0,null=False, blank=False)
    ConsReha = models.IntegerField(default=0,null=False, blank=False)
    ConsGineco = models.IntegerField(default=0,null=False, blank=False)
    Quir1 = models.IntegerField(default=0,null=False, blank=False)
    Quir2 = models.IntegerField(default=0,null=False, blank=False)
    Hab1 = models.IntegerField(default=0,null=False, blank=False)
    Hab2 = models.IntegerField(default=0,null=False, blank=False)
    Hab3 = models.IntegerField(default=0,null=False, blank=False)
    Hab4 = models.IntegerField(default=0,null=False, blank=False)
    Hab5 = models.IntegerField(default=0,null=False, blank=False)
    Hab6 = models.IntegerField(default=0,null=False, blank=False)
    Hab7 = models.IntegerField(default=0,null=False, blank=False)
    Exp1 = models.IntegerField(default=0,null=False, blank=False)
    Inc1 = models.IntegerField(default=0,null=False, blank=False)
    Inc2 = models.IntegerField(default=0,null=False, blank=False)
    RehaEle1 = models.IntegerField(default=0,null=False, blank=False)
    RehaEle2 = models.IntegerField(default=0,null=False, blank=False)
    RehaEle3 = models.IntegerField(default=0,null=False, blank=False)
    RehaEle4 = models.IntegerField(default=0,null=False, blank=False)
    RehaEle5 = models.IntegerField(default=0,null=False, blank=False)
    RehaEle6 = models.IntegerField(default=0,null=False, blank=False)
    RehaEle7 = models.IntegerField(default=0,null=False, blank=False)
    RehaEle8 = models.IntegerField(default=0,null=False, blank=False)
    RehaHid1 = models.IntegerField(default=0,null=False, blank=False)
    RehaMec1 = models.IntegerField(default=0,null=False, blank=False)
    ConsFis1 = models.IntegerField(default=0,null=False, blank=False)
    ConsFis2 = models.IntegerField(default=0,null=False, blank=False)
    ConsFis3 = models.IntegerField(default=0,null=False, blank=False)
    ConsPed = models.IntegerField(default=0,null=False, blank=False)
    ServDom1 = models.IntegerField(default=0,null=False, blank=False)
    ServDom2 = models.IntegerField(default=0,null=False, blank=False)
    ServDomRx = models.IntegerField(default=0,null=False, blank=False)
    Covid = models.IntegerField(default=0,null=False, blank=False)
    Covid2 = models.IntegerField(default=0,null=False, blank=False)
    ExRx = models.IntegerField(default=0,null=False, blank=False)
    ExLab = models.IntegerField(default=0,null=False, blank=False)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update
    Sucursal = models.OneToOneField(Sucursal, null=True, blank=False, on_delete=models.CASCADE)

    def __str__(self):
        return '%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s' % (self.Sang, self.Esp, self.US, self.USD, self.RXS, self.RXC, self.Masto, self.TAC, self.RM, self.Densi, self.Card, self.Pato, self.Colpo, self.Audio, self.Espiro, self.ExLab, self.ExLab)

    class Meta:
        verbose_name_plural = "Semin - Sucursales - Disponibilidad de Servicios"



class CitaSucursal(models.Model):
    fecha_cita = models.DateField(null=True, blank=True)
    hora_inicio = models.TimeField(null=True, blank=True)
    hora_final = models.TimeField(null=True, blank=True)
    id_sala = models.IntegerField(null=True, blank=True,validators=[MinValueValidator(1), MaxValueValidator(100)])
    prueba = models.CharField(max_length=500,null=True, blank=True)
    categoria = models.CharField(max_length=45,null=True, blank=True, choices=ESTUDIO_CHOICES)
    precioVenta = models.FloatField(null=True, blank=True)
    notas = models.CharField(max_length=500,null=True, blank=True)
    estatus = models.CharField(max_length=13,null=True, blank=False, choices=APPOINTMENT_STATUS_CHOICES)
    estatus_rembolso = models.CharField(max_length=10, null=True, blank=True, choices=REMBOLSO_STATUS_CHOICES)
    razon_rembolso = models.CharField(max_length=70, null=True, blank=True, choices=REMBOLSO_RAZON_CHOICES)
    tipo_cita = models.CharField(max_length=11,null=True, blank=False, choices=APPOINTMENT_TYPE_CHOICES)
    id_pago = models.CharField(max_length=90,null=True, blank=True)
    tipo_pago = models.CharField(max_length=10,null=True, blank=True, choices=PAY_CHOICES)
    promocion = models.BooleanField(default=False,null=True, blank=True)
    nombre_promocion = models.CharField(max_length=45,null=True, blank=True)
    app_movil = models.BooleanField(default=False,null=True, blank=True)
    otro_nombre_paciente = models.CharField(max_length=100,null=True, blank=True)
    otro_fecha_nacimento = models.DateField(null=True, blank=True)
    otro_parentesco_paciente = models.CharField(max_length=40,null=True, blank=True)
    creador = models.CharField(max_length=90,null=True, blank=True)
    editor = models.CharField(max_length=90,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update
    costoSucursal = models.FloatField(null=True, blank=True)
    Paciente = models.ForeignKey(Paciente, null=True, blank=True, on_delete=models.SET_NULL)
    Sucursal = models.ForeignKey(Sucursal, null=True, blank=False, on_delete=models.CASCADE)

    def __str__(self):
        return '%s, %s, %s, %s, %s, %s, %s, %s' % (self.fecha_cita,self.hora_inicio,self.hora_final,self.prueba,self.precioVenta, self.estatus,self.tipo_cita, self.Sucursal.nombreSucursal)

    class Meta:
        verbose_name_plural = "Semin - Sucursales - Citas"


class CitaMedico(models.Model):
    fecha_cita = models.DateField(null=True, blank=True)
    hora_inicio = models.TimeField(null=True, blank=True)
    hora_final = models.TimeField(null=True, blank=True)
    tipo = models.CharField(max_length=9,null=True, blank=False, choices=APPOINTMENT_MED_TYPE_CHOICES)
    titulo = models.CharField(max_length=500,null=True, blank=False)
    unidadEnvio = models.CharField(max_length=500,null=True, blank=True)
    telefono = models.IntegerField(null=True, blank=True)
    costo = models.FloatField(null=True, blank=True)
    tipo_pago = models.CharField(max_length=10,null=True, blank=True, choices=PAY_CHOICES)
    notas = models.CharField(max_length=500,null=True, blank=True)
    estatus = models.CharField(max_length=13,null=True, blank=False, choices=APPOINTMENT_MED_STATUS_CHOICES)
    creador = models.CharField(max_length=90,null=True, blank=True)
    editor = models.CharField(max_length=90,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update
    Paciente = models.ForeignKey(Paciente, null=True, blank=True, on_delete=models.SET_NULL)
    Medico = models.ForeignKey(Medico, null=True, blank=False, on_delete=models.CASCADE)

    def __str__(self):
        return '%s, %s, %s, %s, %s, %s' % (self.fecha_cita,self.hora_inicio,self.hora_final,self.titulo,self.costo, self.estatus)

    class Meta:
        verbose_name_plural = "Semin - Médicos - Citas"


class Facturacion(models.Model):
    empresa = models.CharField(max_length=10,null=True, blank=True, default='semin') 
    sucursal = models.CharField(max_length=40,null=True, blank=True, default='No definida' ) 
    factura_estatus = models.CharField(max_length=10,null=True, blank=False,choices=FACTURACION_STATUS_CHOICES)
    nombre = models.CharField(max_length=90,null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45,null=True, blank=False)
    apellido_materno = models.CharField(max_length=45,null=True, blank=True)
    tipo_rfc = models.CharField(max_length=6, null=True, blank=True, choices=RFC_CHOICES)
    rfc = models.CharField(max_length=15, null=True, blank=False)
    cantidad_pagada = models.FloatField(null=True, blank=False)
    calle = models.CharField(max_length=90, null=True, blank=True)
    colonia = models.CharField(max_length=45,null=True, blank=True)
    num_interior = models.CharField(max_length=10,null=True, blank=True)
    num_exterior = models.CharField(max_length=10,null=True, blank=True)
    cp = models.CharField(max_length=5,null=True, blank=True)
    municipio = models.CharField(max_length=45,null=True, blank=True)
    localidad = models.CharField(max_length=200,null=True, blank=True)
    estado = models.CharField(max_length=20,null=True, blank=True, choices=STATE_CHOICES)
    telefono = models.IntegerField(null=True, blank=True)
    email = models.EmailField(max_length=45,null=True, blank=True)
    cfdi_uso = models.CharField(max_length=60,null=True, blank=True, choices=CFDI_CHOICES)
    forma_pago = models.CharField(max_length=40,null=True, blank=True, choices=FORMA_PAGO_CHOICES)
    metodo_pago = models.CharField(max_length=40,null=True, blank=True, choices=MET_PAGO_CHOICES)
    descripcion = models.CharField(max_length=1000, null=True, blank=True)
    analisis_clinicos = models.BooleanField(null=True, blank=True)
    nombre_estudio = models.BooleanField(null=True, blank=True)
    impresion = models.BooleanField(null=True, default=False, blank=True)
    nombre_paciente = models.CharField(max_length=150, null=True, blank=True)
    num_expediente = models.IntegerField(null=True, blank=True)
    num_folio = models.IntegerField(null=True, blank=True)
    estudios_realizados = models.CharField(max_length=1000, null=True, blank=True)
    observaciones = models.CharField(max_length=1000, null=True, blank=True)
    Paciente = models.ForeignKey(Paciente, null=True, blank=True, on_delete=models.CASCADE)
    creador = models.CharField(max_length=90,null=True, blank=True)
    aprobado = models.CharField(max_length=90,null=True, blank=True)
    editor = models.CharField(max_length=90,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s, %s, %s, %s, %s' % (self.nombre, self.apellido_paterno, self.apellido_materno, self.tipo_rfc, self.rfc)

    class Meta:
        verbose_name_plural = "Semin - Facturacion"


class CallCenter(models.Model):
    telefono = models.IntegerField(null=True, blank=False)
    interes = models.CharField(max_length=500, null=True, blank=True)
    nombre = models.CharField(max_length=200,null=True, blank=False)
    experiencia = models.CharField(max_length=2000, null=True, blank=True)
    creador = models.CharField(max_length=90,null=True, blank=True)
    editor = models.CharField(max_length=90,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s, %s' % (self.nombre, self.telefono)

    class Meta:
        verbose_name_plural = "Semin - Call Center"


class Comentarios(models.Model):
    sucursal = models.CharField(max_length=40,null=True, blank=True)
    fecha = models.DateField(null=True, blank=False)
    hora = models.TimeField(null=True, blank=False)
    num_recibo = models.IntegerField(null=True, blank=True)
    nombre_paciente = models.CharField(max_length=100,null=True, blank=False)
    telefono = models.IntegerField(null=True, blank=True)
    email = models.EmailField(max_length=45,null=True, blank=True)
    estudios_solicitados = models.CharField(max_length=300,null=True, blank=True) 
    como_entero = models.CharField(max_length=20,null=True, blank=True,choices=COMO_ENTERO_CHOICES)
    tipo_opinion = models.CharField(max_length=20,null=True, blank=False,choices=TIPO_OPINION_CHOICES)
    nombre_personal = models.CharField(max_length=100,null=True, blank=True)
    comentarios = models.CharField(max_length=300,null=True, blank=False) 
    notas = models.CharField(max_length=500,null=True, blank=True)
    Paciente = models.ForeignKey(Paciente, null=True, blank=True, on_delete=models.CASCADE)
    creador = models.CharField(max_length=90,null=True, blank=True)
    editor = models.CharField(max_length=90,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s, %s, %s, %s' % (self.nombre_paciente, self.tipo_opinion, self.fecha, self.hora)

    class Meta:
        verbose_name_plural = "Semin - Paciente Comentarios"


class QuejasSugerencias(models.Model):
    folio = models.IntegerField(null=True, blank=True)
    tipo = models.CharField(max_length=20,null=True, blank=False ,choices=QUEJA_SUGERENCIA_TIPO_CHOICES)
    fecha_evento = models.DateField(null=True, blank=False)
    hora_evento = models.TimeField(null=True, blank=False)
    sucursal = models.CharField(max_length=40,null=True, blank=True)
    tipo_recibo = models.CharField(max_length=30,null=True, blank=False,choices=RECIBO_TIPO_CHOICES)
    nombre_presentante = models.CharField(max_length=100,null=True, blank=False)
    telefono = models.IntegerField(null=True, blank=True)
    email = models.EmailField(max_length=45,null=True, blank=True)
    descripcion = models.CharField(max_length=300,null=True, blank=False) 
    nombre_personal = models.CharField(max_length=100,null=True, blank=True)
    puesto_personal = models.CharField(max_length=40,null=True, blank=True)
    fecha_recibo = models.DateField(null=True, blank=True)
    nombre_encargado = models.CharField(max_length=100,null=True, blank=True)
    puesto_encargado = models.CharField(max_length=40,null=True, blank=True)
    fecha_encargado = models.DateField(null=True, blank=True)
    procede = models.CharField(max_length=3,null=True, blank=False ,choices=SI_NO_CHOICES)
    recurrente = models.CharField(max_length=3,null=True, blank=False ,choices=SI_NO_CHOICES)
    notas = models.CharField(max_length=500,null=True, blank=True)
    Paciente = models.ForeignKey(Paciente, null=True, blank=True, on_delete=models.CASCADE)
    creador = models.CharField(max_length=90,null=True, blank=True)
    editor = models.CharField(max_length=90,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s, %s, %s, %s, %s' % (self.nombre_presentante, self.tipo, self.tipo_recibo, self.fecha_evento , self.hora_evento)

    class Meta:
        verbose_name_plural = "Semin - Paciente Quejas & Sugerencias"


class Catalogo(models.Model):
    area = models.CharField(max_length=200,null=True, blank=False)
    categoria = models.CharField(max_length=45,null=True, blank=False, choices=ESTUDIO_CHOICES)
    sala =  models.CharField(max_length=45,null=True, blank=True, choices=SALA_ESTUDIO_CHOICES)
    sexo = models.CharField(max_length=1,null=True, blank=True, choices=SEXO_ESTUDIO_CHOICES)
    domingos = models.BooleanField(default=False,null=True, blank=True)
    domicilio = models.BooleanField(default=False,null=True, blank=True)
    prueba = models.CharField(max_length=1000,null=True, blank=False)
    sinAcro = models.CharField(max_length=1000,null=True, blank=True)
    beneficio = models.CharField(max_length=1200,null=True, blank=False)
    tipoMuestra = models.CharField(max_length=1000,null=True, blank=True)
    indicacionesPreExamen = models.CharField(max_length=1000,null=True, blank=False)
    otrasIndicaciones = models.CharField(max_length=1000,null=True, blank=True)
    tiempoEntrega = models.CharField(max_length=500,null=True, blank=False)
    precioVenta = models.FloatField(null=True, blank=False)
    precioApoyo = models.FloatField(null=True, blank=True)
    precioNormal = models.FloatField(null=True, blank=True)
    clave = models.CharField(max_length=1000,null=True, blank=True)
    ranking = models.IntegerField(default=0, null=True, blank=False)


    def __str__(self):
        return '%s, %s, %s, %s, %s' % (self.id, self.area, self.prueba, self.precioVenta, self.ranking)

    class Meta:
        verbose_name_plural = "Semin - Catálogo de Estudios"


class Carrousel(models.Model):
    titulo = models.CharField(max_length=90,null=True, blank=False)
    link = models.CharField(max_length=400,null=True, blank=False)
    imagen = models.ImageField(upload_to='images/carrousel', null=True, blank=False)
    caducidad = models.DateField(null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s' % (self.titulo)

    class Meta:
        verbose_name_plural = "Semin - Carrousel"


class Promocion(models.Model):
    titulo = models.CharField(max_length=90,null=True, blank=False)
    descripcion = models.CharField(max_length=400,null=True, blank=False)
    indicaciones =  models.CharField(max_length=400,null=True, blank=False)
    precioVenta = models.FloatField(null=True, blank=False)
    sexo = models.CharField(max_length=1,null=True, blank=True, choices=SEXO_ESTUDIO_CHOICES)
    imagen = models.ImageField(upload_to='images/promociones', null=True, blank=False)
    caducidad = models.DateField(null=True, blank=False)
    estudioInicial = models.IntegerField(null=True, blank=False)
    Catalogo = SortedManyToManyField(Catalogo)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s, %s, %s' % (self.titulo, self.precioVenta, self.caducidad)

    class Meta:
        verbose_name_plural = "Semin - Catálogo de Promociónes"


class PromocionTicket(models.Model): #FRONT
    titulo = models.CharField(max_length=90,null=True, blank=False)
    prueba = models.CharField(max_length=1000,null=True, blank=False)
    descripcion = models.CharField(max_length=400,null=True, blank=False)
    indicaciones =  models.CharField(max_length=400,null=True, blank=False)
    precioVenta = models.FloatField(null=True, blank=False)
    numVentas = models.IntegerField(null=True, blank=False)
    sexo = models.CharField(max_length=1,null=True, blank=True, choices=SEXO_ESTUDIO_CHOICES)
    imagen = models.ImageField(upload_to='images/promociones', null=True, blank=False)
    caducidad = models.DateField(null=True, blank=False)
    estudioInicial = models.IntegerField(null=True, blank=False)
    Catalogo = SortedManyToManyField(Catalogo)
    registro = models.BooleanField(default=False, null=False, blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s, %s, %s' % (self.titulo, self.precioVenta, self.caducidad)

    class Meta:
        verbose_name_plural = "Semin - Catálogo de Promociónes Ticket"
        

class PrimeraEncuesta(models.Model):
    preguntaUno = models.CharField(max_length=20, choices=CORRECT_INFORMATION)
    preguntaDos = models.CharField(max_length=50, choices=ESTUDIO_CHOICES_ENCUESTAS)
    preguntaTres = models.CharField(max_length=10, choices=USER_EXPERIENCE)
    Sucursal = models.ForeignKey(Sucursal, null=True, blank=True, on_delete=models.SET_NULL)
    Paciente = models.OneToOneField(Paciente, null=True, blank=True, on_delete=models.SET_NULL)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s, %s, %s' % (self.preguntaUno, self.preguntaDos, self.preguntaTres)

    class Meta:
        verbose_name_plural = "Encuesta - Primera"



class Cie10(models.Model):
    LETRA = models.CharField(max_length=400,null=True, blank=True)
    CATALOG_KEY = models.CharField(max_length=400,null=True, blank=True)
    ASTERISCO = models.CharField(max_length=400,null=True, blank=True)
    NOMBRE = models.CharField(max_length=400,null=True, blank=True)
    LSEX = models.CharField(max_length=400,null=True, blank=True)
    LINF = models.CharField(max_length=400,null=True, blank=True)
    LSUP = models.CharField(max_length=400,null=True, blank=True)
    TRIVIAL = models.CharField(max_length=400,null=True, blank=True)
    ERRADICADO = models.CharField(max_length=400,null=True, blank=True)
    N_INTER = models.CharField(max_length=400,null=True, blank=True)
    NIN = models.CharField(max_length=400,null=True, blank=True)
    NINMTOBS = models.CharField(max_length=400,null=True, blank=True)
    NO_CBD = models.CharField(max_length=400,null=True, blank=True)
    NO_APH = models.CharField(max_length=400,null=True, blank=True)
    FETAL = models.CharField(max_length=400,null=True, blank=True)
    CLAVE_CAPITULO_TYPE = models.CharField(max_length=400,null=True, blank=True)
    CAPITULO_TYPE = models.CharField(max_length=400,null=True, blank=True)
    RUBRICA_TYPE = models.CharField(max_length=400,null=True, blank=True)
    YEAR_MODIFI = models.CharField(max_length=400,null=True, blank=True)
    YEAR_APLICACION = models.CharField(max_length=400,null=True, blank=True)
    NOTDIARIA = models.CharField(max_length=400,null=True, blank=True)
    NOTSEMANAL = models.CharField(max_length=400,null=True, blank=True)
    SISTEMA_ESPECIAL = models.CharField(max_length=400,null=True, blank=True)
    BIRMM = models.CharField(max_length=400,null=True, blank=True)
    CVE_CAUSA_TYPE = models.CharField(max_length=400,null=True, blank=True)
    CAUSA_TYPE = models.CharField(max_length=400,null=True, blank=True)
    EPI_MORTA = models.CharField(max_length=400,null=True, blank=True)
    EPI_MORTA_M5 = models.CharField(max_length=400,null=True, blank=True)
    EDAS_E_IRAS_EN_M5 = models.CharField(max_length=400,null=True, blank=True)
    LISTA1 = models.CharField(max_length=400,null=True, blank=True)
    LISTA5 = models.CharField(max_length=400,null=True, blank=True)
    PRINMORTA = models.CharField(max_length=400,null=True, blank=True)
    PRINMORBI = models.CharField(max_length=400,null=True, blank=True)
    LM_MORBI = models.CharField(max_length=400,null=True, blank=True)
    LM_MORTA = models.CharField(max_length=400,null=True, blank=True)
    LGBD165 = models.CharField(max_length=400,null=True, blank=True)
    LOMSBECK = models.CharField(max_length=400,null=True, blank=True)
    LGBD190 = models.CharField(max_length=400,null=True, blank=True)
    ES_CAUSES = models.CharField(max_length=400,null=True, blank=True)
    NUM_CAUSES = models.CharField(max_length=400,null=True, blank=True)
    ES_SUIVE_MORTA = models.CharField(max_length=400,null=True, blank=True)
    DAGA = models.CharField(max_length=400,null=True, blank=True)
    EPI_CLAVE = models.CharField(max_length=400,null=True, blank=True)
    EPI_CLAVE_DESC = models.CharField(max_length=400,null=True, blank=True)
    ES_SUIVE_MORB = models.CharField(max_length=400,null=True, blank=True)
    ES_SUIVE_NOTIN = models.CharField(max_length=400,null=True, blank=True)
    ES_SUIVE_EST_EPI = models.CharField(max_length=400,null=True, blank=True)
    ES_SUIVE_EST_BROTE = models.CharField(max_length=400,null=True, blank=True)
    SINAC = models.CharField(max_length=400,null=True, blank=True)
    CODIGOX = models.CharField(max_length=400,null=True, blank=True)
    COD_SIT_LESION = models.CharField(max_length=400,null=True, blank=True)

    def __str__(self):
        return '%s, %s, %s' % (self.LETRA, self.CATALOG_KEY, self.NOMBRE)

    class Meta:
        verbose_name_plural = "CIE-10"

class HistoriaClinica(models.Model):
    entidad_nacimiento = models.CharField(max_length=20,null=True, blank=True, choices=STATE_CHOICES)
    religion= models.CharField(max_length=45 ,null=True, blank=True)
    ocupacion= models.CharField(max_length=90 ,null=True, blank=True)
    calle = models.CharField(max_length=90, null=True, blank=True)
    colonia = models.CharField(max_length=45,null=True, blank=True)
    num_interior = models.CharField(max_length=10,null=True, blank=True)
    num_exterior = models.CharField(max_length=10,null=True, blank=True)
    cp = models.CharField(max_length=5,null=True, blank=True)
    municipio = models.CharField(max_length=45,null=True, blank=True)
    localidad = models.CharField(max_length=200,null=True, blank=True)
    estado = models.CharField(max_length=20,null=True, blank=True, choices=STATE_CHOICES)
    telefonoCasa = models.IntegerField(null=True, blank=True)
    telefonoOficina = models.IntegerField(null=True, blank=True)
    telefonoCelular = models.IntegerField(null=True, blank=True)
    email = models.EmailField(max_length=45,null=True, blank=True)
    hijos = models.BooleanField(null=True, blank=True)
    numHijos = models.IntegerField(null=True, blank=True)
    estadoCivil = models.CharField(max_length=12,null=True, blank=True,  choices=ESTADO_CIVIL_CHOICES)
    maxGradoEstudios = models.CharField(max_length=50,null=True, blank=True)
    estadoSalud = models.CharField(max_length=200,null=True, blank=True)
    tipoInterrogatorio = models.CharField(max_length=10,null=True, blank=True,  choices=INTERROGATION_CHOICES)
    informador = models.CharField(max_length=200,null=True, blank=True)
    peso = models.FloatField(null=True, blank=True)
    talla = models.FloatField(null=True, blank=True)
    indiceMasaCorporal = models.FloatField(null=True, blank=True)
    frecuenciaCardiaca = models.IntegerField(null=True, blank=True)
    frecuenciaRespiratoria = models.IntegerField(null=True, blank=True)
    tensionArterialSistole = models.IntegerField(null=True, blank=True)
    tensionArterialDiastole = models.IntegerField(null=True, blank=True)
    sexo = models.CharField(max_length=9,null=True, blank=True, choices=SEX_CHOICES)
    sistemaNeurologico = models.CharField(max_length=2000,null=True, blank=True)
    sistemaTegumentario = models.CharField(max_length=2000,null=True, blank=True)
    sistemaMusculoEsqueletico = models.CharField(max_length=2000,null=True, blank=True)
    sistemaRespiratorio = models.CharField(max_length=2000,null=True, blank=True)
    sistemaDigestivo = models.CharField(max_length=2000,null=True, blank=True)
    sistemaUrinario = models.CharField(max_length=2000,null=True, blank=True)
    sistemaReproductor = models.CharField(max_length=2000,null=True, blank=True)
    sistemasSentidos = models.CharField(max_length=2000,null=True, blank=True)
    temperatura= models.FloatField(null=True, blank=True)
    antecedentesFamiliares = models.CharField(max_length=2000,null=True, blank=True)
    antecedentesPersonalesNoPatologicos = models.CharField(max_length=2000,null=True, blank=True)
    antecedentesPersonalesPatologicos = models.CharField(max_length=2000,null=True, blank=True)
    procedimientoActual = models.CharField(max_length=2000,null=True, blank=True)
    auxiliaresDiagnostico = models.CharField(max_length=2000,null=True, blank=True)
    Paciente = models.ForeignKey(Paciente, null=True, blank=False, on_delete=models.CASCADE)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return ' %s %s %s %s' % (self.Paciente.nombre, self.Paciente.apellido_paterno, self.Paciente.apellido_materno, self.ultimaActualizacion)


    class Meta:
        verbose_name_plural = "Pacientes - Expediente - Historia Clinica"



class Consulta(models.Model):
    notaEvolucion = models.CharField(max_length=2000,null=True, blank=True)
    especialidad = models.CharField(max_length=30,null=True, blank=True, choices=SPECIALITY_CHOICES)
    peso = models.FloatField(null=True, blank=True)
    talla = models.FloatField(null=True, blank=True)
    indiceMasaCorporal = models.FloatField(null=True, blank=True)
    frecuenciaCardiaca = models.IntegerField(null=True, blank=True)
    frecuenciaRespiratoria = models.IntegerField(null=True, blank=True)
    tensionArterialSistole = models.IntegerField(null=True, blank=True)
    tensionArterialDiastole = models.IntegerField(null=True, blank=True)
    temperatura= models.FloatField(null=True, blank=True)
    sexo = models.CharField(max_length=9,null=True, blank=True, choices=SEX_CHOICES)
    subjetivo = models.CharField(max_length=4000,null=True, blank=True)
    objetivo = models.CharField(max_length=4000,null=True, blank=True)
    analisis = models.CharField(max_length=4000,null=True, blank=True)
    clinicos = models.CharField(max_length=4000,null=True, blank=True)
    impresionDiagnostica = models.CharField(max_length=4000,null=True, blank=True) #cie10
    manejoRecomendaciones = models.CharField(max_length=4000,null=True, blank=True)
    plan = models.CharField(max_length=4000,null=True, blank=True)
    tituloUno = models.CharField(max_length=200,null=True, blank=True)
    notaUno = models.CharField(max_length=4000,null=True, blank=True)
    tituloDos = models.CharField(max_length=200,null=True, blank=True)
    notaDos = models.CharField(max_length=4000,null=True, blank=True)
    tituloTres = models.CharField(max_length=200,null=True, blank=True)
    notaTres = models.CharField(max_length=4000,null=True, blank=True)
    tituloCuatro = models.CharField(max_length=200,null=True, blank=True)
    notaCuatro = models.CharField(max_length=4000,null=True, blank=True)
    Paciente = models.ForeignKey(Paciente, null=True, blank=False, on_delete=models.CASCADE)
    Medico = models.ForeignKey(Medico, null=True, blank=True, on_delete=models.CASCADE)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    class Meta:
        verbose_name_plural = "Pacientes - Expediente - Consulta"


    def __str__(self):
        return '%s %s %s' % (self.Paciente.nombre, self.Paciente.apellido_paterno, self.Paciente.apellido_materno)


class TablaPermisos(models.Model):
    token = models.CharField(max_length=60,unique=True, null=True, blank=True)
    caducidad = models.DateField(null=True, blank=False)
    email = models.EmailField(max_length=45 ,null=True, blank=True)
    tipo = models.CharField(max_length=9,null=True, blank=False, choices=PERMISO_CHOICES)
    estatus = models.CharField(max_length=9,null=True, blank=False, choices=PERMISO_ESTATUS_CHOICES)
    Medico = models.ForeignKey(Medico, null=True, blank=True, on_delete=models.SET_NULL)
    Paciente = models.ForeignKey(Paciente, null=True, blank=False, on_delete=models.CASCADE)  
    creador = models.CharField(max_length=90,null=True, blank=False)
    editor = models.CharField(max_length=90,null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s %s %s %s %s' % (self.Paciente.nombre, self.Paciente.apellido_paterno, self.Paciente.apellido_materno, self.caducidad, self.tipo)


    class Meta:
        verbose_name_plural = "Pacientes - Expediente - Tabla de Permisos"


class PagoOpenPay(models.Model):
    environment = models.CharField(max_length=500,null=True, blank=False)
    product_name = models.CharField(max_length=500,null=True, blank=False)
    paypal_sdk_version= models.CharField(max_length=500,null=True, blank=False)
    platform= models.CharField(max_length=500,null=True, blank=False)
    response_type= models.CharField(max_length=500,null=True, blank=False)
    response= models.CharField(max_length=500,null=True, blank=False)
    id_pay= models.CharField(max_length=500,null=True, blank=False)
    state= models.CharField(max_length=500,null=True, blank=False)
    create_time= models.CharField(max_length=500,null=True, blank=False)
    intent= models.CharField(max_length=500,null=True, blank=False)
    id_cita = models.IntegerField(null=True, blank=True)
    Paciente = models.ForeignKey(Paciente, null=True, blank=False, on_delete=models.CASCADE)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s' % (self.id_pay)

    class Meta:
        verbose_name_plural = "Semin - Pago Open Pay"


class HistoricoPago(models.Model):
    data = models.CharField(max_length=10000,null=True, blank=False)
    Paciente = models.ForeignKey(Paciente, null=True, blank=False, on_delete=models.CASCADE)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s %s' % (self.id, self.creacion)

    class Meta:
        verbose_name_plural = "Registro - Historico de Pagos"


class ConsultasClientes(models.Model):
    consulta = models.CharField(max_length=200,null=True, blank=False)
    origen = models.CharField(max_length=10,null=True, blank=True, choices=SOURCE_TYPE_CHOICES)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s, %s' % (self.consulta, self.creacion)

    class Meta:
        verbose_name_plural = "Semin - Consultas Clientes"


class LoginClientes(models.Model):
    Paciente = models.ForeignKey(Paciente, null=True, blank=False, on_delete=models.CASCADE)
    origen = models.CharField(max_length=10,null=True, blank=True, choices=LOGIN_CHOICES)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s %s' % (self.origen, self.creacion)


    class Meta:
        verbose_name_plural = "Registro - Login Clientes"


class Bolsa(models.Model):
    titulo = models.CharField(max_length=200,null=True, blank=False)
    salario = models.CharField(max_length=50,null=True, blank=False)
    zona_trabajo = models.CharField(max_length=200,null=True, blank=False)
    sexo = models.CharField(max_length=12,null=True, blank=False, choices=SEX_CHOICES_RH)
    disp_viajar = models.CharField(max_length=12,null=True, blank=False, choices=CORRECT_INFORMATION)
    disp_residencia = models.CharField(max_length=12,null=True, blank=False, choices=CORRECT_INFORMATION)  
    edad = models.CharField(max_length=50,null=True, blank=False)
    escolaridad = models.CharField(max_length=200,null=True, blank=False)
    experiencia = models.CharField(max_length=200,null=True, blank=False)
    automovil = models.BooleanField(default=False, null=False, blank=False)
    tipo_licencia = models.CharField(max_length=200,null=True, blank=True)
    descripcion = models.CharField(max_length=2000,null=True, blank=False)
    actividades = models.CharField(max_length=2000,null=True, blank=False)
    fecha_contratacion = models.DateField(null=False, blank=False)
    conocimiento_uno = models.CharField(max_length=200,null=True, blank=False)
    conocimiento_dos = models.CharField(max_length=200,null=True, blank=True)
    conocimiento_tres = models.CharField(max_length=200,null=True, blank=True)
    conocimiento_cuatro = models.CharField(max_length=200,null=True, blank=True)
    conocimiento_cinco = models.CharField(max_length=200,null=True, blank=True)
    conocimiento_seis = models.CharField(max_length=200,null=True, blank=True)
    conocimiento_siete = models.CharField(max_length=200,null=True, blank=True)
    conocimiento_ocho = models.CharField(max_length=200,null=True, blank=True)
    conocimiento_nueve = models.CharField(max_length=200,null=True, blank=True)
    conocimiento_diez = models.CharField(max_length=200,null=True, blank=True)
    funciones_uno = models.CharField(max_length=200,null=True, blank=True)
    funciones_dos = models.CharField(max_length=200,null=True, blank=True)
    funciones_tres = models.CharField(max_length=200,null=True, blank=True)
    funciones_cuatro = models.CharField(max_length=200,null=True, blank=True)
    funciones_cinco = models.CharField(max_length=200,null=True, blank=True)
    funciones_seis = models.CharField(max_length=200,null=True, blank=True)
    funciones_siete = models.CharField(max_length=200,null=True, blank=True)
    funciones_ocho = models.CharField(max_length=200,null=True, blank=True)
    funciones_nueve = models.CharField(max_length=200,null=True, blank=True)
    funciones_diez = models.CharField(max_length=200,null=True, blank=True)
    disp_viajar = models.CharField(max_length=200,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s %s' % (self.titulo, self.fecha_contratacion)


    class Meta:
        verbose_name_plural = "RH - Bolsa de trabajo"


class VersionCliente(models.Model):
    version = models.CharField(max_length=10,null=True, blank=False)
    descripcion = models.CharField(max_length=500,null=True, blank=True)
    tipo = models.CharField(max_length=10,null=True, blank=True, choices=VERSIONS_CHOICES)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s, %s' % (self.version, self.tipo)

    class Meta:
        verbose_name_plural = "Semin - Versión Dispositivos Móviles"


class Empresa(models.Model):
    nombreEmpresa= models.CharField(max_length=200, null=False, blank=False)
    creador = models.CharField(max_length=90,null=True, blank=True)
    editor = models.CharField(max_length=90,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s' % (self.nombreEmpresa)

    class Meta:
        verbose_name_plural = "Empresa"


class EstudioEmpresa(models.Model):

    def validate_file(fieldfile_obj):
        filesize = fieldfile_obj.size
        megabyte_limit = 30.0
        if filesize > megabyte_limit*1024*1024:
            raise ValidationError("Max file size is %sMB" % str(megabyte_limit))

    usuario = models.CharField(max_length=14,null=True, blank=  False)
    password = models.CharField(max_length=14,null=True, blank=False)
    solicitud = models.IntegerField(null=True, blank=True)
    file = models.FileField(upload_to='estudioEmpresa/', validators=[validate_file], blank=False, null=True)
    caducidad = models.DateField(null=True, blank=True)
    fecha_realizacion = models.DateField(null=True, blank=False)
    categoria = models.CharField(max_length=45,null=True, blank=False, choices=ESTUDIO_CHOICES)
    nombreEstudio = models.CharField(max_length=1000, null=True, blank=False)	
    Paciente = models.ForeignKey(Paciente, null=True, blank=True, on_delete=models.SET_NULL)
    Empresa = models.ForeignKey(Empresa, null=True, blank=True, on_delete=models.SET_NULL)
    creador = models.CharField(max_length=90,null=True, blank=True)
    editor = models.CharField(max_length=90,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s, %s' % (self.usuario, self.creacion)

    class Meta:
        verbose_name_plural = "Empresa - Estudios Empresa"


class RegistroVideollamada(models.Model):
    fecha_cita = models.DateField(null=True, blank=False)
    hora_inicio = models.TimeField(null=True, blank=False)
    hora_final = models.TimeField(null=True, blank=False)
    Paciente = models.OneToOneField(Paciente, null=True, blank=False, on_delete=models.SET_NULL)
    Medico = models.ForeignKey(Medico, null=True, blank=False, on_delete=models.SET_NULL)
    creador = models.CharField(max_length=90,null=True, blank=False)
    editor = models.CharField(max_length=90,null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s, %s, %s' % (self.fecha_cita, self.hora_inicio, self.hora_final)

    class Meta:
        verbose_name_plural = "Registro - Videollamadas"


class FondoLogin(models.Model):
    titulo = models.CharField(max_length=90,null=True, blank=False)
    imagen = models.ImageField(upload_to='images/login', null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s' % (self.titulo)

    class Meta:
        verbose_name_plural = "Semin - Fondo de Login"


class Rehabilitacion(models.Model):

    def validate_file(fieldfile_obj):
        filesize = fieldfile_obj.size
        megabyte_limit = 20.0
        if filesize > megabyte_limit*1024*1024:
            raise ValidationError("Max file size is %sMB" % str(megabyte_limit))

    nombre = models.CharField(max_length=50, null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45, null=True, blank=False)
    apellido_materno = models.CharField(max_length=45, null=True, blank=False)
    fecha_nacimiento = models.DateField(null=False, blank=False)
    sexo = models.CharField(max_length=9, null=True, blank=False, choices=SEX_CHOICES)
    status = models.CharField(max_length=20, null=True, blank=False, default="Pendiente", choices=STATUS_EXPEDIENTE_REHABILITACION_CHOICES)
    hoja_430 = models.FileField(upload_to='rehabilitacion/adultos/', validators=[validate_file], blank=False, null=True)
    constancia_vigencia = models.FileField(upload_to='rehabilitacion/adultos/', validators=[validate_file], blank=False, null=True)
    orden_trabajo = models.FileField(upload_to='rehabilitacion/adultos/', validators=[validate_file], blank=False, null=True)
    identificacion = models.FileField(upload_to='rehabilitacion/adultos/', validators=[validate_file], blank=False, null=True)
    carnet = models.FileField(upload_to='rehabilitacion/adultos/', validators=[validate_file], blank=False, null=True)
    bitacora = models.FileField(upload_to='rehabilitacion/adultos/', validators=[validate_file], blank=True, null=True)
    numero_firmas = models.CharField(max_length=3, null=True, blank=True, default="0")
    acta = models.FileField(upload_to='rehabilitacion/adultos/', validators=[validate_file], blank=True, null=True)
    curp = models.FileField(upload_to='rehabilitacion/adultos/', validators=[validate_file], blank=True, null=True)
    observaciones = models.CharField(max_length=200,null=True, blank=True) 
    creacion = models.DateTimeField(auto_now_add=True)
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '%s %s %s %s' % (self.nombre,self.apellido_paterno, self.apellido_materno, self.fecha_nacimiento)

    class Meta:
        verbose_name_plural = "Rehabilitacion - Documentos"

   
class Fisioterapeuta(models.Model):
    nombre = models.CharField(max_length=90,null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45,null=True, blank=False)
    apellido_materno = models.CharField(max_length=45,null=True, blank=False)
    fecha_nacimiento = models.DateField(null=True, blank=False)
    sexo = models.CharField(max_length=9,null=True, blank=False, choices=SEX_CHOICES)
    telefono = models.IntegerField(null=True, blank=True)
    email = models.EmailField(max_length=45, unique=True ,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '%s %s %s %s %s' % (self.nombre, self.apellido_paterno, self.apellido_materno, self.telefono, self.email)
    
    class Meta:
        verbose_name_plural = "Semin - Fisioterapeuta"

class Mensajero(models.Model):
    nombre = models.CharField(max_length=90,null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45,null=True, blank=False)
    apellido_materno = models.CharField(max_length=45,null=True, blank=False)
    fecha_nacimiento = models.DateField(null=True, blank=False)
    sexo = models.CharField(max_length=9,null=True, blank=False, choices=SEX_CHOICES)
    telefono = models.IntegerField(null=True, blank=True)
    email = models.EmailField(max_length=45, unique=True ,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '%s %s %s %s' % (self.nombre, self.apellido_paterno, self.apellido_materno, self.telefono)
    
    class Meta:
        verbose_name_plural = "Semin - Mensajeros"

class SensorTemperatura(models.Model):
    temperatura = models.CharField(max_length=90,null=True, blank=False)
    identificador = models.CharField(max_length=90,null=True, blank=False)
    mensajero = models.ForeignKey(Mensajero, null=True, blank=False, on_delete=models.CASCADE)
    creacion = models.DateTimeField(auto_now_add=True)
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '%s' % (self.temperatura)
    
    class Meta:
        verbose_name_plural = "Semin - Temperaturas"


# modelos de almacen 👇
class Area(models.Model):
    nombre = models.CharField(max_length=90,null=True, blank=False)
    id_sucursal = models.ForeignKey(Sucursal, null=True, blank=False, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Semin - Areas"


class Proveedor(models.Model):
    nombre_compañia = models.CharField(max_length=90,null=True, blank=False)
    nombre_contacto = models.CharField(max_length=90, null=True, blank=False)
    apellidoP_contacto = models.CharField(max_length=45,null=True, blank=False)
    apellidoM_contacto = models.CharField(max_length=45,null=True, blank=False)
    telefono = models.IntegerField(null=True, blank=True)
    celular = models.IntegerField(null=True, blank=True)
    direccion = models.CharField(max_length=90,null=True, blank=False)
    email = models.EmailField(max_length=45, unique=True ,null=True, blank=True)
    tipo_proveedor = models.CharField(max_length=40, null=True, blank=False, choices=TIPO_PROVEEDOR_CHOISE)
    nota = models.CharField(max_length=150,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Semin - Proveedores"


class Productos(models.Model):

    def validate_file(fieldfile_obj):
        filesize = fieldfile_obj.size
        megabyte_limit = 20.0
        if filesize > megabyte_limit*1024*1024:
            raise ValidationError("Max file size is %sMB" % str(megabyte_limit))

    nombre = models.CharField(max_length=90,null=True, blank=False) 
    presentacion = models.CharField(max_length=40, null=True, blank=False, choices=TIPO_PRESENTACION_CHOISE)
    fecha_ingreso = models.DateField(null=False, blank=False)
    fecha_caducidad = models.DateField(null=False, blank=False)
    lote = models.CharField(max_length=50,null=True, blank=True)
    stok = models.IntegerField(null=True, blank=False)
    stok_max = models.IntegerField(null=True, blank=False)
    stok_min = models.IntegerField(null=True, blank=False)
    ubicacion =  models.CharField(max_length=40, null=True, blank=False, choices=UBICACION_PRODUCTO_CHOISE)
    caracteristicas = models.CharField(max_length=50,null=True, blank=True)
    imagen = models.FileField(upload_to='productos/', validators=[validate_file], blank=True, null=True)
    proveedor = models.ForeignKey(Proveedor, null=True, blank=True, on_delete=models.CASCADE)
    sucursal = models.ForeignKey(Sucursal, null=True, blank=False, on_delete=models.CASCADE)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Semin - Productos Almacen Principal"


class Producto(models.Model):
    nombre = models.CharField(max_length=90,null=True, blank=False) 
    presentacion = models.CharField(max_length=40, null=True, blank=False, choices=TIPO_PRESENTACION_CHOISE)
    fecha_ingreso = models.DateField(null=False, blank=False)
    fecha_caducidad = models.DateField(null=False, blank=False)
    stok = models.IntegerField(null=True, blank=False)
    stok_max = models.IntegerField(null=True, blank=False)
    stok_min = models.IntegerField(null=True, blank=False)
    caracteristicas = models.CharField(max_length=50,null=True, blank=True)
    sucursal = models.ForeignKey(Sucursal, null=True, blank=True, on_delete=models.CASCADE)
    area = models.ForeignKey(Area, null=True, blank=True, on_delete=models.CASCADE)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Semin - Productos Almacenes"


class Devoluciones(models.Model):
    id_produtos = models.ForeignKey(Productos, null=True, blank=False, on_delete=models.CASCADE)
    id_proveedores = models.ForeignKey(Proveedor, null=True, blank=False, on_delete=models.CASCADE)
    fecha_devolucion = models.DateField(null=False, blank=False)
    motivo = models.CharField(max_length=150,null=True, blank=False)
    nota = models.CharField(max_length=150,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Semin - Devoluciones de Productos"


class Solicitud(models.Model):
    id_sucursal = models.ForeignKey(Sucursal, null=True, blank=False, on_delete=models.CASCADE)
    id_empleado = models.ForeignKey(Empleado, null=True, blank=False, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=150,null=True, blank=False)
    nota = models.CharField(max_length=150,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Semin - Solicitud de Productos"


class Envio(models.Model):
    id_sucursal = models.ForeignKey(Sucursal, null=True, blank=False, on_delete=models.CASCADE)
    id_empleado = models.ForeignKey(Empleado, null=True, blank=False, on_delete=models.CASCADE)
    id_producto = models.ForeignKey(Productos, null=True, blank=False, on_delete=models.CASCADE)
    nota = models.CharField(max_length=150,null=True, blank=True)
    medio = models.CharField(max_length=50, null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Semin - Envio de Productos"


class Correo(models.Model):
    nombre = models.CharField(max_length=180,null=True, blank=False)
    telefono = models.IntegerField(null=True, blank=False)
    email = models.EmailField(max_length=45,null=True, blank=False)
    comentario = models.CharField(max_length=2000, null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True) # When it was create
    ultimaActualizacion = models.DateTimeField(auto_now=True) # When i was update

    def __str__(self):
        return '%s, %s' % (self.nombre, self.email)

    class Meta:
        verbose_name_plural = "Semin - Correos"

