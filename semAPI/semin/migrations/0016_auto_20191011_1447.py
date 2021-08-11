# Generated by Django 2.1.7 on 2019-10-11 19:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0015_auto_20191011_1446'),
    ]

    operations = [
        migrations.AlterField(
            model_name='catalogo',
            name='categoria',
            field=models.CharField(choices=[('Propios_lab', 'Propios_lab'), ('Maquila_lab', 'Maquila_lab'), ('US', 'US'), ('RXS', 'RXS'), ('RXC', 'RXC'), ('Masto', 'Masto'), ('TACS', 'TACS'), ('TACC', 'TACC'), ('RMS', 'RMS'), ('RMC', 'RMC'), ('Densi', 'Densi'), ('EKG', 'EKG'), ('Papa', 'Papa'), ('Colpo', 'Colpo'), ('Audio', 'Audio')], max_length=45, null=True),
        ),
        migrations.AlterField(
            model_name='estudio',
            name='tipoEstudio',
            field=models.CharField(blank=True, max_length=90, null=True),
        ),
    ]
