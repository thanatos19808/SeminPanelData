# Generated by Django 2.1.7 on 2019-10-25 14:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0037_auto_20191025_0919'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='promocion',
            name='Catalogo',
        ),
    ]
