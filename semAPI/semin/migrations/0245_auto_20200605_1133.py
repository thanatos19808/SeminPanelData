# Generated by Django 2.1.7 on 2020-06-05 16:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0244_tablapermisos_estatus'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tablapermisos',
            name='Paciente',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Paciente'),
        ),
        migrations.AlterField(
            model_name='tablapermisos',
            name='caducidad',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='tablapermisos',
            name='creador',
            field=models.CharField(max_length=90, null=True),
        ),
        migrations.AlterField(
            model_name='tablapermisos',
            name='editor',
            field=models.CharField(max_length=90, null=True),
        ),
        migrations.AlterField(
            model_name='tablapermisos',
            name='estatus',
            field=models.CharField(choices=[('ACTIVO', 'ACTIVO'), ('INACTIVO', 'INACTIVO')], max_length=9, null=True),
        ),
        migrations.AlterField(
            model_name='tablapermisos',
            name='tipo',
            field=models.CharField(choices=[('INTERNO', 'INTERNO'), ('EXTERNO', 'EXTERNO')], max_length=9, null=True),
        ),
    ]