# Generated by Django 2.1.7 on 2021-02-12 18:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0319_estudioempresa'),
    ]

    operations = [
        migrations.RenameField(
            model_name='estudioempresa',
            old_name='contraseña',
            new_name='password',
        ),
    ]
