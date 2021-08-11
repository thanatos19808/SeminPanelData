from django.db import models
from semin.models import Sucursal
from .ventas_models import EMPRESA_CHOICES

class EstudiosAtendidosTomador(models.Model):
    empresa = models.CharField(max_length=45,null=True, blank=False, choices=EMPRESA_CHOICES)
    sucursal = models.ForeignKey(Sucursal, null=True, blank=False, on_delete=models.CASCADE)
    tomador = models.CharField(max_length=45,null=True, blank=False)
    numero_estudios = models.IntegerField(null=True, blank=False)
    estudio = models.CharField(max_length=45,null=True, blank=False)
    date = models.DateField(null=True, blank=False)
    hora = models.TimeField(null=True, blank=False)
    liquidado = models.BooleanField(null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Panel Data - Productividad Estudios atendidos por tomador"


class PacientesAtendidos(models.Model):
    sucursal = models.ForeignKey(Sucursal, null=True, blank=False, on_delete=models.CASCADE)
    nombre_paciente = models.CharField(max_length=45,null=True, blank=False)
    expediente = models.CharField(null=True, blank=False)
    date = models.DateField(null=True, blank=False)
    empresa = models.CharField(max_length=45,null=True, blank=False, choices=EMPRESA_CHOICES)
    estudios = models.CharField(max_length=45,null=True, blank=False)
    importe = models.IntegerField(null=True, blank=False)
    iva = models.IntegerField(null=True, blank=False)
    total = models.IntegerField(null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Panel Data - Productividad Pacientes atendidos"