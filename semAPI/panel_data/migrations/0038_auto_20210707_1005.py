# Generated by Django 2.1.7 on 2021-07-07 15:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('panel_data', '0037_auto_20210707_1004'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='useradminpanel',
            name='cambio_estudio',
        ),
        migrations.RemoveField(
            model_name='useradminpanel',
            name='corte_caja',
        ),
        migrations.RemoveField(
            model_name='useradminpanel',
            name='devoluciones',
        ),
        migrations.RemoveField(
            model_name='useradminpanel',
            name='tipos_pagos',
        ),
        migrations.RemoveField(
            model_name='useradminpanel',
            name='venta_areas',
        ),
        migrations.RemoveField(
            model_name='useradminpanel',
            name='venta_departamentos',
        ),
        migrations.RemoveField(
            model_name='useradminpanel',
            name='venta_estudios',
        ),
        migrations.RemoveField(
            model_name='useradminpanel',
            name='venta_sucursal',
        ),
        migrations.RemoveField(
            model_name='useradminpanel',
            name='venta_tolal',
        ),
    ]
