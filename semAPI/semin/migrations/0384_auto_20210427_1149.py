# Generated by Django 2.1.7 on 2021-04-27 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0383_auto_20210426_1450'),
    ]

    operations = [
        migrations.AlterField(
            model_name='catalogo',
            name='categoria',
            field=models.CharField(choices=[('Analisis Sanguineos', 'Analisis Sanguineos'), ('Analisis Clinicos', 'Analisis Clinicos'), ('Ultrasonografia', 'Ultrasonografia'), ('Ultrasonografia Doppler', 'Ultrasonografia Doppler'), ('Rayos X', 'Rayos X'), ('Rayos X Contrastados', 'Rayos X Contrastados'), ('Mastografia', 'Mastografia'), ('Papanicolau', 'Papanicolau'), ('Tomografia', 'Tomografia'), ('Tomografia Contrastada', 'Tomografia Contrastada'), ('Resonancia Magnetica', 'Resonancia Magnetica'), ('Resonancia Magnetica Contrastada', 'Resonancia Magnetica Contrastada'), ('Colposcopia', 'Colposcopia'), ('Densitometria', 'Densitometria'), ('Audiologia', 'Audiologia'), ('Espirometria', 'Espirometria'), ('Patologia', 'Patologia'), ('Consulta', 'Consulta'), ('Ginecologia', 'Ginecologia'), ('Cardiologia', 'Cardiologia'), ('Rehabilitacion', 'Rehabilitacion'), ('Cirugia', 'Cirugia'), ('Covid', 'Covid')], max_length=45, null=True),
        ),
        migrations.AlterField(
            model_name='citasucursal',
            name='categoria',
            field=models.CharField(blank=True, choices=[('Analisis Sanguineos', 'Analisis Sanguineos'), ('Analisis Clinicos', 'Analisis Clinicos'), ('Ultrasonografia', 'Ultrasonografia'), ('Ultrasonografia Doppler', 'Ultrasonografia Doppler'), ('Rayos X', 'Rayos X'), ('Rayos X Contrastados', 'Rayos X Contrastados'), ('Mastografia', 'Mastografia'), ('Papanicolau', 'Papanicolau'), ('Tomografia', 'Tomografia'), ('Tomografia Contrastada', 'Tomografia Contrastada'), ('Resonancia Magnetica', 'Resonancia Magnetica'), ('Resonancia Magnetica Contrastada', 'Resonancia Magnetica Contrastada'), ('Colposcopia', 'Colposcopia'), ('Densitometria', 'Densitometria'), ('Audiologia', 'Audiologia'), ('Espirometria', 'Espirometria'), ('Patologia', 'Patologia'), ('Consulta', 'Consulta'), ('Ginecologia', 'Ginecologia'), ('Cardiologia', 'Cardiologia'), ('Rehabilitacion', 'Rehabilitacion'), ('Cirugia', 'Cirugia'), ('Covid', 'Covid')], max_length=45, null=True),
        ),
        migrations.AlterField(
            model_name='estudioempresa',
            name='categoria',
            field=models.CharField(choices=[('Analisis Sanguineos', 'Analisis Sanguineos'), ('Analisis Clinicos', 'Analisis Clinicos'), ('Ultrasonografia', 'Ultrasonografia'), ('Ultrasonografia Doppler', 'Ultrasonografia Doppler'), ('Rayos X', 'Rayos X'), ('Rayos X Contrastados', 'Rayos X Contrastados'), ('Mastografia', 'Mastografia'), ('Papanicolau', 'Papanicolau'), ('Tomografia', 'Tomografia'), ('Tomografia Contrastada', 'Tomografia Contrastada'), ('Resonancia Magnetica', 'Resonancia Magnetica'), ('Resonancia Magnetica Contrastada', 'Resonancia Magnetica Contrastada'), ('Colposcopia', 'Colposcopia'), ('Densitometria', 'Densitometria'), ('Audiologia', 'Audiologia'), ('Espirometria', 'Espirometria'), ('Patologia', 'Patologia'), ('Consulta', 'Consulta'), ('Ginecologia', 'Ginecologia'), ('Cardiologia', 'Cardiologia'), ('Rehabilitacion', 'Rehabilitacion'), ('Cirugia', 'Cirugia'), ('Covid', 'Covid')], max_length=45, null=True),
        ),
    ]
