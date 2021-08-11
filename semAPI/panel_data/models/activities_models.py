from django.db import models
from semin.models import *


# model for admin user of panel data
class UserAdminPanel(models.Model):
    nombre = models.CharField(max_length=90,null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45,null=True, blank=False)
    apellido_materno = models.CharField(max_length=45,null=True, blank=False)
    fecha_nacimiento = models.DateField(null=True, blank=False)
    sexo = models.CharField(max_length=9,null=True, blank=False, choices=SEX_CHOICES)
    telefono = models.IntegerField(null=True, blank=True)
    email = models.EmailField(max_length=45, unique=True ,null=True, blank=True)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Panel Data - Administrador Auditor"


class UserAdmin(models.Model):
    nombre = models.CharField(max_length=90,null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45,null=True, blank=False)
    apellido_materno = models.CharField(max_length=45,null=True, blank=False)
    fecha_nacimiento = models.DateField(null=True, blank=False)
    sexo = models.CharField(max_length=9,null=True, blank=False, choices=SEX_CHOICES)
    telefono = models.IntegerField(null=True, blank=True)
    email = models.EmailField(max_length=45, unique=True ,null=True, blank=True)
    venta_tolal = models.BooleanField(default=False, null=False, blank=True)
    venta_sucursal = models.BooleanField(default=False, null=False, blank=True)
    venta_estudios = models.BooleanField(default=False, null=False, blank=True)
    venta_departamentos = models.BooleanField(default=False, null=False, blank=True)
    venta_areas = models.BooleanField(default=False, null=False, blank=True)
    corte_caja = models.BooleanField(default=False, null=False, blank=True)
    tipos_pagos = models.BooleanField(default=False, null=False, blank=True)
    devoluciones = models.BooleanField(default=False, null=False, blank=True)
    cambio_estudio = models.BooleanField(default=False, null=False, blank=True)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '%s %s %s' % (self.nombre, self.apellido_paterno, self.apellido_materno)

    class Meta:
        verbose_name_plural = "Panel Data - Administrador"



# secret models for activities en panel data
class ActivityLogin(models.Model):
    nombre = models.CharField(max_length=45, null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45, null=True, blank=False)
    apellido_materno = models.CharField(max_length=45, null=True, blank=False)
    date = models.DateField(null=True, blank=False)
    action = models.CharField(max_length=45, null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Panel Data - Actividades Login"


class ActivityViews(models.Model):
    nombre = models.CharField(max_length=45, null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45, null=True, blank=False)
    apellido_materno = models.CharField(max_length=45, null=True, blank=True)
    consulta = models.CharField(max_length=150, null=True, blank=False)
    datos = models.CharField(max_length=150, null=True, blank=False)
    date = models.DateField(null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Panel Data - Actividades Vista"
