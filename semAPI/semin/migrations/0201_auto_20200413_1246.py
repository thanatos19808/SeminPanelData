# Generated by Django 2.1.7 on 2020-04-13 17:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0200_catalogo_domicilio'),
    ]

    operations = [
        migrations.CreateModel(
            name='TablaPermisos',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(max_length=60, null=True)),
                ('caducidad', models.DateField(null=True)),
                ('correoDoctor', models.CharField(max_length=60, null=True)),
                ('externo', models.BooleanField(default=True, null=True)),
                ('creador', models.CharField(max_length=90, null=True)),
                ('editor', models.CharField(max_length=90, null=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
                ('Paciente', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Paciente')),
            ],
            options={
                'verbose_name_plural': 'Pacientes - Expediente - Tabla de Permisos',
            },
        ),
        migrations.AlterField(
            model_name='primeraencuesta',
            name='preguntaDos',
            field=models.CharField(choices=[('Analisis Sanguineos', 'Analisis Sanguineos'), ('Analisis Clinicos', 'Analisis Clinicos'), ('Ultrasonografia', 'Ultrasonografia'), ('Ultrasonografia Doppler', 'Ultrasonografia Doppler'), ('Rayos X', 'Rayos X'), ('Rayos X Contrastados', 'Rayos X Contrastados'), ('Mastografia', 'Mastografia'), ('Papanicolau', 'Papanicolau'), ('Tomografia', 'Tomografia'), ('Tomografia Contrastada', 'Tomografia Contrastada'), ('Resonancia Magnetica', 'Resonancia Magnetica'), ('Resonancia Magnetica Contrastada', 'Resonancia Magnetica Contrastada'), ('Colposcopia', 'Colposcopia'), ('Densitometria', 'Densitometria'), ('Audiologia', 'Audiologia'), ('Espirometria', 'Espirometria'), ('Patologia', 'Patologia'), ('Consulta', 'Consulta'), ('Cardiologia', 'Cardiologia'), ('Rehabilitacion', 'Rehabilitacion'), ('Otro', 'Otro')], max_length=50),
        ),
    ]
