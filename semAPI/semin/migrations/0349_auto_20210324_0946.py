# Generated by Django 2.1.7 on 2021-03-24 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0348_fisioterapeuta_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='fisioterapeuta',
            name='status',
        ),
        migrations.AddField(
            model_name='rehabilitacion',
            name='status',
            field=models.CharField(choices=[('Correcto', 'Correcto'), ('Incorrecto', 'Incorrecto'), ('Pendiente', 'Pendiente')], max_length=20, null=True),
        ),
    ]
