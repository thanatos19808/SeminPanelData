# Generated by Django 2.1.7 on 2020-11-27 17:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0309_auto_20201124_1501'),
    ]

    operations = [
        migrations.AddField(
            model_name='paciente',
            name='monedero',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='tipo',
            field=models.CharField(blank=True, choices=[('Medico', 'Medico'), ('Paciente', 'Paciente'), ('Operador', 'Operador'), ('Administrador', 'Administrador'), ('Radiologo', 'Radiologo')], max_length=14, null=True),
        ),
    ]