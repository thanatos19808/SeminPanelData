# Generated by Django 2.1.7 on 2020-04-13 16:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0197_consulta_paciente'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='consulta',
            name='Paciente',
        ),
        migrations.DeleteModel(
            name='Consulta',
        ),
    ]
