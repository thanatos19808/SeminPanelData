# Generated by Django 2.1.7 on 2020-01-17 18:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0104_remove_paciente_num_tarjeta'),
    ]

    operations = [
        migrations.AddField(
            model_name='tiemposervicio',
            name='Card',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='tiemposervicio',
            name='Cons',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='tiemposervicio',
            name='USD',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='catalogo',
            name='categoria',
            field=models.CharField(choices=[('Analisis Sanguíneos', 'Analisis Sanguíneos'), ('Analisis Clínicos', 'Analisis Clínicos'), ('Ultrasonografía', 'Ultrasonografía'), ('Ultrasonografía Doppler', 'Ultrasonografía Doppler'), ('Rayos X', 'Rayos X'), ('Rayos X Contrastados', 'Rayos X Contrastados'), ('Mastografía', 'Mastografía'), ('Papanicolau', 'Papanicolau'), ('Electrocardiograma', 'Electrocardiograma'), ('Tomografía', 'Tomografía'), ('Tomografía Contrastada', 'Tomografía Contrastada'), ('Resonancia Magnética', 'Resonancia Magnética'), ('Resonancia Magnética Contrastada', 'Resonancia Magnética Contrastada'), ('Colposcopía', 'Colposcopía'), ('Densitometría', 'Densitometría'), ('Audiología', 'Audiología'), ('Espirometría', 'Espirometría'), ('Patología', 'Patología'), ('Consulta', 'Consulta'), ('Cardiología', 'Cardiología')], max_length=45, null=True),
        ),
        migrations.AlterField(
            model_name='catalogo',
            name='sala',
            field=models.CharField(blank=True, choices=[('Sang', 'Sang'), ('Esp', 'Esp'), ('US', 'US'), ('USD', 'USD'), ('RXS', 'RXS'), ('RXC', 'RXC'), ('Masto', 'Masto'), ('EKG', 'EKG'), ('TAC', 'TAC'), ('RM', 'RM'), ('Colpo', 'Colpo'), ('Densi', 'Densi'), ('Cli', 'Cli'), ('Card', 'Card'), ('Cons', 'Cons'), ('Externo', 'Externo')], max_length=45, null=True),
        ),
        migrations.AlterField(
            model_name='citasucursal',
            name='categoria',
            field=models.CharField(blank=True, choices=[('Analisis Sanguíneos', 'Analisis Sanguíneos'), ('Analisis Clínicos', 'Analisis Clínicos'), ('Ultrasonografía', 'Ultrasonografía'), ('Ultrasonografía Doppler', 'Ultrasonografía Doppler'), ('Rayos X', 'Rayos X'), ('Rayos X Contrastados', 'Rayos X Contrastados'), ('Mastografía', 'Mastografía'), ('Papanicolau', 'Papanicolau'), ('Electrocardiograma', 'Electrocardiograma'), ('Tomografía', 'Tomografía'), ('Tomografía Contrastada', 'Tomografía Contrastada'), ('Resonancia Magnética', 'Resonancia Magnética'), ('Resonancia Magnética Contrastada', 'Resonancia Magnética Contrastada'), ('Colposcopía', 'Colposcopía'), ('Densitometría', 'Densitometría'), ('Audiología', 'Audiología'), ('Espirometría', 'Espirometría'), ('Patología', 'Patología'), ('Consulta', 'Consulta'), ('Cardiología', 'Cardiología')], max_length=45, null=True),
        ),
    ]
