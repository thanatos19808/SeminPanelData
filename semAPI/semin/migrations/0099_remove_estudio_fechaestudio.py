# Generated by Django 2.1.7 on 2019-12-23 20:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0098_auto_20191223_1257'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='estudio',
            name='fechaEstudio',
        ),
    ]
