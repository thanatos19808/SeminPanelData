# Generated by Django 2.1.7 on 2020-02-18 15:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0125_auto_20200204_1347'),
    ]

    operations = [
        migrations.AlterField(
            model_name='citasucursal',
            name='estatus',
            field=models.CharField(choices=[('ACTIVA', 'ACTIVA'), ('CERRADA', 'CERRADA'), ('CARRITO', 'CARRITO'), ('CANCELADA', 'CANCELADA'), ('REMBOLSO', 'REMBOLSO')], max_length=13, null=True),
        ),
    ]
