# Generated by Django 2.1.7 on 2021-06-25 15:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('panel_data', '0021_auto_20210624_1544'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='cajerooperador',
            options={'verbose_name_plural': 'Panel Data - Cajero Operador'},
        ),
        migrations.AlterModelOptions(
            name='ventadespartamentoarea',
            options={'verbose_name_plural': 'Panel Data - Ventas por Departamento'},
        ),
        migrations.AlterModelOptions(
            name='ventaestudios',
            options={'verbose_name_plural': 'Panel Data - Ventas por Estudios'},
        ),
    ]
