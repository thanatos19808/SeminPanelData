# Generated by Django 2.1.7 on 2020-04-06 21:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0177_auto_20200406_1529'),
    ]

    operations = [
        migrations.AlterField(
            model_name='primeraencuesta',
            name='preguntaDos',
            field=models.CharField(choices=[('Analisis Sanguineos', 'Analisis Sanguineos'), ('Analisis Clinicos', 'Analisis Clinicos'), ('Ultrasonografia', 'Ultrasonografia'), ('Ultrasonografia Doppler', 'Ultrasonografia Doppler'), ('Rayos X', 'Rayos X'), ('Rayos X Contrastados', 'Rayos X Contrastados'), ('Mastografia', 'Mastografia'), ('Papanicolau', 'Papanicolau'), ('Tomografia', 'Tomografia'), ('Tomografia Contrastada', 'Tomografia Contrastada'), ('Resonancia Magnetica', 'Resonancia Magnetica'), ('Resonancia Magnetica Contrastada', 'Resonancia Magnetica Contrastada'), ('Colposcopia', 'Colposcopia'), ('Densitometria', 'Densitometria'), ('Audiologia', 'Audiologia'), ('Espirometria', 'Espirometria'), ('Patologia', 'Patologia'), ('Consulta', 'Consulta'), ('Cardiologia', 'Cardiologia'), ('Rehabilitacion', 'Rehabilitacion')], max_length=50),
        ),
        migrations.AlterField(
            model_name='primeraencuesta',
            name='preguntaTres',
            field=models.CharField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5'), (6, '6'), (7, '7'), (8, '8'), (9, '9'), (10, '10')], max_length=10),
        ),
    ]
