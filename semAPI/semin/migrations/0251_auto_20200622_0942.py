# Generated by Django 2.1.7 on 2020-06-22 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0250_disponibilidadservicio_servdomrx'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tablapermisos',
            name='tipo',
            field=models.CharField(choices=[('INTERNO', 'INTERNO'), ('EXTERNO', 'EXTERNO')], max_length=14, null=True),
        ),
    ]