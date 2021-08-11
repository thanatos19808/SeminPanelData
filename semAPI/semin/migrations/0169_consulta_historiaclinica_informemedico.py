# Generated by Django 2.1.7 on 2020-04-03 19:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0168_cie10'),
    ]

    operations = [
        migrations.CreateModel(
            name='Consulta',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('preguntaUno', models.CharField(blank=True, max_length=20, null=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Paciente - Consulta',
            },
        ),
        migrations.CreateModel(
            name='HistoriaClinica',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('preguntaUno', models.CharField(blank=True, max_length=20, null=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Paciente - Historia Clinica',
            },
        ),
        migrations.CreateModel(
            name='InformeMedico',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('preguntaUno', models.CharField(blank=True, max_length=20, null=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Paciente - Informe Medico',
            },
        ),
    ]