from django.db import models
from semin.models import *

# Model of panel data.
EMPRESA_CHOICES=(
    ('semin', 'semin'),
    ('salud para todos', 'salud para todos'),
)

AREA_CHOICES=(
    ('Laboratorio', 'Laboratorio'), 
    ('Imagenologia', 'Imagenologia'),
)

TYPE_VENTA_CHOICES=(
    ('particular', 'particular'),
    ('empresa', 'empresa')
)


class VentaEstudios(models.Model):
    empresa = models.CharField(max_length=45,null=True, blank=False, choices=EMPRESA_CHOICES)
    sucursal = models.ForeignKey(Sucursal, null=True, blank=False, on_delete=models.CASCADE)
    estudio = models.CharField(max_length=45,null=True, blank=False, choices=ESTUDIO_CHOICES)
    numero_estudios = models.IntegerField(null=True, blank=False)
    liquidado = models.BooleanField(null=True, blank=False)
    tipo = models.CharField(max_length=45,null=True, blank=False, choices=TYPE_VENTA_CHOICES)
    importe = models.FloatField(null=True, blank=False)
    total = models.FloatField(null=True, blank=False)
    date = models.DateField(null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Panel Data - Ventas por Estudios"


class VentaDespartamentoArea(models.Model):
    empresa = models.CharField(max_length=45,null=True, blank=False, choices=EMPRESA_CHOICES)
    sucursal = models.ForeignKey(Sucursal, null=True, blank=False, on_delete=models.CASCADE)
    departamento = models.CharField(max_length=45,null=True, blank=False)
    area = models.CharField(max_length=45,null=True, blank=False, choices=AREA_CHOICES)
    numero_estudios = models.IntegerField(null=True, blank=False)
    liquidado = models.BooleanField(null=True, blank=False)
    tipo = models.CharField(max_length=45,null=True, blank=False, choices=TYPE_VENTA_CHOICES)
    importe = models.FloatField(null=True, blank=False)
    total = models.FloatField(null=True, blank=False)
    date = models.DateField(null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Panel Data - Ventas por Departamento"


class VentasTotal(models.Model):
    empresa = models.CharField(max_length=45,null=True, blank=False, choices=EMPRESA_CHOICES)
    date = models.DateField(null=True, blank=False)
    total = models.FloatField(null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Panel Data - Ventas totales por empresa"