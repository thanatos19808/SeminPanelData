# Generated by Django 2.1.7 on 2020-03-02 20:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0130_auto_20200226_1606'),
    ]

    operations = [
        migrations.AddField(
            model_name='citasucursal',
            name='apellido_materno',
            field=models.CharField(blank=True, max_length=45, null=True),
        ),
        migrations.AddField(
            model_name='citasucursal',
            name='apellido_paterno',
            field=models.CharField(blank=True, max_length=45, null=True),
        ),
        migrations.AddField(
            model_name='citasucursal',
            name='estatus_facturacion',
            field=models.CharField(blank=True, choices=[('SOLICITADO', 'SOLICITADO'), ('APROBADO', 'APROBADO'), ('RECHAZADO', 'RECHAZADO')], max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='citasucursal',
            name='nombre',
            field=models.CharField(blank=True, max_length=90, null=True),
        ),
        migrations.AddField(
            model_name='citasucursal',
            name='rfc',
            field=models.CharField(blank=True, max_length=15, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='citasucursal',
            name='tipo_rfc',
            field=models.CharField(blank=True, choices=[('FISICA', 'FISICA'), ('MORAL', 'MORAL')], max_length=6, null=True),
        ),
    ]
