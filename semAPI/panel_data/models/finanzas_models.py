from django.db import models
from semin.models import *
from .ventas_models import EMPRESA_CHOICES


TYPE_PAY_CHOICES=(
    ('Efectivo','Efectivo'),
    ('Transferencia electronica','Transferencia electronica'),
    ('Tarjeta de credito','Tarjeta de credito'),
    ('Tarjeta de debito','Tarjeta de debito'),
)


class CajeroOperador(models.Model):
    empresa = models.CharField(max_length=45, null=True, blank=False, choices=EMPRESA_CHOICES)
    sucursal = models.ForeignKey(Sucursal, null=True, blank=False, on_delete=models.CASCADE)
    cajero_empleado = models.ForeignKey(Empleado, null=True, blank=False, on_delete=models.CASCADE)
    hora_entrada = models.TimeField(null=True, blank=False)
    hora_salida = models.TimeField(null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '%s'  % (self.cajero_empleado)

    class Meta:
        verbose_name_plural = "Panel Data - Cajero Operador"


class AperturaCierreCaja(models.Model):
    empresa = models.CharField(max_length=45, null=True, blank=False, choices=EMPRESA_CHOICES)
    sucursal = models.ForeignKey(Sucursal, null=True, blank=False, on_delete=models.CASCADE)
    cajero = models.ForeignKey(CajeroOperador, null=True, blank=False, on_delete=models.CASCADE)
    monto_inicial = models.FloatField(null=True, blank=False)
    hora_inicio = models.TimeField(null=True, blank=False)
    monto_final = models.FloatField(null=True, blank=False)
    hora_final = models.TimeField(null=True, blank=False)
    date = models.DateField(null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '%s, %s, %s'  % (self.empresa, self.sucursal, self.date)

    class Meta:
        verbose_name_plural = "Panel Data - Apartura de caja"


class Movimientos(models.Model):
    folio = models.IntegerField(null=True, blank=False)
    numero_solicitudes = models.IntegerField(null=True, blank=False)
    tipo_pago = models.CharField(max_length=45,null=True, blank=False, choices=TYPE_PAY_CHOICES)
    convenio = models.CharField(max_length=90,null=True, blank=False)
    total = models.FloatField(null=True, blank=False)
    cajero = models.ForeignKey(CajeroOperador, null=True, blank=False, on_delete=models.CASCADE)
    apertura_cierre = models.ForeignKey(AperturaCierreCaja, null=True, blank=False, on_delete=models.CASCADE)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Panel Data - Movimientos en caja"


class Devoluciones(models.Model):
    empresa = models.CharField(max_length=45, null=True, blank=False, choices=EMPRESA_CHOICES)
    sucursal = models.ForeignKey(Sucursal, null=True, blank=False, on_delete=models.CASCADE)
    cajero = models.ForeignKey(CajeroOperador, null=True, blank=False, on_delete=models.CASCADE)
    tipo_devolucion = models.CharField(max_length=45,null=True, blank=False, choices=TYPE_PAY_CHOICES)
    total = models.FloatField(null=True, blank=False)
    date = models.DateField(null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Panel Data - Devoluciones"