# Generated by Django 2.1.7 on 2020-07-04 00:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0266_auto_20200703_1017'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='facturacion',
            name='CitaSucursal',
        ),
        migrations.AlterField(
            model_name='facturacion',
            name='sucursal',
            field=models.CharField(blank=True, default='No definida', max_length=40, null=True),
        ),
    ]
