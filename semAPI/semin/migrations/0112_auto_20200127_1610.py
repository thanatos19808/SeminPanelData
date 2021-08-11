# Generated by Django 2.1.7 on 2020-01-27 22:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0111_auto_20200124_1147'),
    ]

    operations = [
        migrations.AlterField(
            model_name='catalogo',
            name='categoria',
            field=models.CharField(choices=[('Analisis Sanguineos', 'Analisis Sanguineos'), ('Analisis Clinicos', 'Analisis Clinicos'), ('Ultrasonografia', 'Ultrasonografia'), ('Ultrasonografia Doppler', 'Ultrasonografia Doppler'), ('Rayos X', 'Rayos X'), ('Rayos X Contrastados', 'Rayos X Contrastados'), ('Mastografia', 'Mastografia'), ('Papanicolau', 'Papanicolau'), ('Electrocardiograma', 'Electrocardiograma'), ('Tomografia', 'Tomografia'), ('Tomografia Contrastada', 'Tomografia Contrastada'), ('Resonancia Magnetica', 'Resonancia Magnetica'), ('Resonancia Magnetica Contrastada', 'Resonancia Magnetica Contrastada'), ('Colposcopía', 'Colposcopía'), ('Densitometria', 'Densitometria'), ('Audiologia', 'Audiologia'), ('Espirometria', 'Espirometria'), ('Patologia', 'Patologia'), ('Consulta', 'Consulta'), ('Cardiologia', 'Cardiologia')], max_length=45, null=True),
        ),
        migrations.AlterField(
            model_name='citasucursal',
            name='categoria',
            field=models.CharField(blank=True, choices=[('Analisis Sanguineos', 'Analisis Sanguineos'), ('Analisis Clinicos', 'Analisis Clinicos'), ('Ultrasonografia', 'Ultrasonografia'), ('Ultrasonografia Doppler', 'Ultrasonografia Doppler'), ('Rayos X', 'Rayos X'), ('Rayos X Contrastados', 'Rayos X Contrastados'), ('Mastografia', 'Mastografia'), ('Papanicolau', 'Papanicolau'), ('Electrocardiograma', 'Electrocardiograma'), ('Tomografia', 'Tomografia'), ('Tomografia Contrastada', 'Tomografia Contrastada'), ('Resonancia Magnetica', 'Resonancia Magnetica'), ('Resonancia Magnetica Contrastada', 'Resonancia Magnetica Contrastada'), ('Colposcopía', 'Colposcopía'), ('Densitometria', 'Densitometria'), ('Audiologia', 'Audiologia'), ('Espirometria', 'Espirometria'), ('Patologia', 'Patologia'), ('Consulta', 'Consulta'), ('Cardiologia', 'Cardiologia')], max_length=45, null=True),
        ),
    ]
