# Generated by Django 2.1.7 on 2020-01-24 15:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0107_auto_20200120_0857'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='catalogo',
            name='creacion',
        ),
        migrations.RemoveField(
            model_name='catalogo',
            name='domingos',
        ),
        migrations.RemoveField(
            model_name='catalogo',
            name='ultimaActualizacion',
        ),
    ]
