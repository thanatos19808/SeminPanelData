# Generated by Django 2.1.7 on 2019-10-28 19:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0044_auto_20191028_0959'),
    ]

    operations = [
        migrations.AlterField(
            model_name='citasucursal',
            name='estatus',
            field=models.CharField(choices=[('ACTIVA', 'ACTIVA'), ('CERRADA', 'CERRADA'), ('CARRITO', 'CARRITO'), ('CANCELADA', 'CANCELADA')], max_length=13, null=True),
        ),
    ]
