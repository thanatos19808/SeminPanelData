# Generated by Django 2.1.7 on 2020-03-03 21:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0138_auto_20200303_1902'),
    ]

    operations = [
        migrations.RenameField(
            model_name='facturacion',
            old_name='cfdi',
            new_name='cfdi_uso',
        ),
    ]
