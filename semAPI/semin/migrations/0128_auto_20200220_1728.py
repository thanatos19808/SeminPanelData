# Generated by Django 2.1.7 on 2020-02-20 23:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0127_citasucursal_estatus_rembolso'),
    ]

    operations = [
        migrations.AlterField(
            model_name='citasucursal',
            name='estatus',
            field=models.CharField(choices=[('ACTIVA', 'ACTIVA'), ('CERRADA', 'CERRADA'), ('CARRITO', 'CARRITO'), ('CANCELADA', 'CANCELADA')], max_length=13, null=True),
        ),
    ]