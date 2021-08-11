from django.db import models

from .ventas_models import EMPRESA_CHOICES


TIPOS_GASTOS_PAGADOS_CHOICES=(
    ('MAQUILA Y HONORARIOS','MAQUILA Y HONORARIOS'),
    ('LOGISTICA','LOGISTICA'),
    ('MANTENIMIENTO','MANTENIMIENTO'),
    ('ALMACEN','ALMACEN'),
    ('BIOMEDICOS','BIOMEDICOS'),
    ('SUMINISTROS','SUMINISTROS'),
    ('VIATICOS Y DIETA','VIATICOS Y DIETA'),
    ('GASTOS DIRECCION','GASTOS DIRECCION'),
    ('TRAMITES Y FINIQUITOS','TRAMITES Y FINIQUITOS'),
)


class GastosPagados(models.Model):
    empresa = models.CharField(max_length=45, null=True, blank=False, choices=EMPRESA_CHOICES)
    tipo = models.CharField(max_length=45, null=True, blank=False, choices=TIPOS_GASTOS_PAGADOS_CHOICES)
    date = models.DateField(null=True, blank=False)
    proveedor = models.CharField(max_length=45, null=True, blank=False)
    concepto = models.CharField(max_length=45, null=True, blank=False)
    area = models.CharField(max_length=45, null=True, blank=False)
    sucursal = models.ForeignKey(Sucursal, null=True, blank=False, on_delete=models.CASCADE)
    detalle = models.CharField(max_length=500, null=True, blank=False)
    total = models.FloatField(null=True, blank=False)
    fecha_pago = models.DateField(null=True, blank=False)
    observaciones = models.CharField(max_length=500, null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Panel Data - Gastos Pagados"