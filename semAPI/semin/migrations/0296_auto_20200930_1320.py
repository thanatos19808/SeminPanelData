# Generated by Django 2.1.7 on 2020-09-30 18:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0295_estudio_fecha_subida'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='estudio',
            name='fecha_subida',
        ),
        migrations.AddField(
            model_name='estudio',
            name='fecha_realizacion',
            field=models.DateField(null=True),
        ),
    ]