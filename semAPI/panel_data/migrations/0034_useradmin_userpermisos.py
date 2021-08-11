# Generated by Django 2.1.7 on 2021-07-05 17:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('panel_data', '0033_activityviews_datos'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserAdmin',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=90, null=True)),
                ('apellido_paterno', models.CharField(max_length=45, null=True)),
                ('apellido_materno', models.CharField(max_length=45, null=True)),
                ('fecha_nacimiento', models.DateField(null=True)),
                ('sexo', models.CharField(choices=[('masculino', 'masculino'), ('femenino', 'femenino')], max_length=9, null=True)),
                ('telefono', models.IntegerField(blank=True, null=True)),
                ('email', models.EmailField(blank=True, max_length=45, null=True, unique=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Panel Data - Administrador',
            },
        ),
        migrations.CreateModel(
            name='UserPermisos',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('venta_tolal', models.BooleanField(blank=True, default=False)),
                ('venta_sucursal', models.BooleanField(blank=True, default=False)),
                ('venta_estudios', models.BooleanField(blank=True, default=False)),
                ('venta_departamentos', models.BooleanField(blank=True, default=False)),
                ('venta_areas', models.BooleanField(blank=True, default=False)),
                ('corte_caja', models.BooleanField(blank=True, default=False)),
                ('tipos_pagos', models.BooleanField(blank=True, default=False)),
                ('devoluciones', models.BooleanField(blank=True, default=False)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
                ('usuario', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='panel_data.UserAdmin')),
            ],
            options={
                'verbose_name_plural': 'Panel Data - Permisos para Administradores',
            },
        ),
    ]