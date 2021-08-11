# Generated by Django 2.1.7 on 2020-12-01 16:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0311_auto_20201127_1558'),
    ]

    operations = [
        migrations.AlterField(
            model_name='primeraencuesta',
            name='preguntaDos',
            field=models.CharField(choices=[('Analisis Sanguineos', 'Analisis Sanguineos'), ('Analisis Clinicos', 'Analisis Clinicos'), ('Ultrasonografia', 'Ultrasonografia'), ('Ultrasonografia Doppler', 'Ultrasonografia Doppler'), ('Rayos X', 'Rayos X'), ('Rayos X Contrastados', 'Rayos X Contrastados'), ('Mastografia', 'Mastografia'), ('Papanicolau', 'Papanicolau'), ('Tomografia', 'Tomografia'), ('Tomografia Contrastada', 'Tomografia Contrastada'), ('Resonancia Magnetica', 'Resonancia Magnetica'), ('Resonancia Magnetica Contrastada', 'Resonancia Magnetica Contrastada'), ('Colposcopia', 'Colposcopia'), ('Densitometria', 'Densitometria'), ('Audiologia', 'Audiologia'), ('Espirometria', 'Espirometria'), ('Patologia', 'Patologia'), ('Consulta', 'Consulta'), ('Ginecologia', 'Ginecologia'), ('Cardiologia', 'Cardiologia'), ('Rehabilitacion', 'Rehabilitacion'), ('Otro', 'Otro')], max_length=50),
        ),
    ]