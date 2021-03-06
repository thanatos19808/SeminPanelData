# Generated by Django 2.1.7 on 2020-04-13 16:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0198_auto_20200413_1142'),
    ]

    operations = [
        migrations.CreateModel(
            name='Consulta',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('peso', models.FloatField(blank=True, null=True)),
                ('talla', models.FloatField(blank=True, null=True)),
                ('indiceMasaCorporal', models.FloatField(blank=True, null=True)),
                ('frecuenciaCardiaca', models.IntegerField(blank=True, null=True)),
                ('frecuenciaRespiratoria', models.IntegerField(blank=True, null=True)),
                ('tensionnArterialSistole', models.IntegerField(blank=True, null=True)),
                ('tensionArterialDiastole', models.IntegerField(blank=True, null=True)),
                ('temperatura', models.FloatField(blank=True, null=True)),
                ('sexo', models.CharField(blank=True, choices=[('masculino', 'masculino'), ('femenino', 'femenino')], max_length=9, null=True)),
                ('subjetivo', models.CharField(blank=True, max_length=2000, null=True)),
                ('objetivo', models.CharField(blank=True, max_length=2000, null=True)),
                ('analisis', models.CharField(blank=True, max_length=2000, null=True)),
                ('clinicos', models.CharField(blank=True, max_length=2000, null=True)),
                ('impresionDiagnostica', models.CharField(blank=True, max_length=2000, null=True)),
                ('manejoRecomendaciones', models.CharField(blank=True, max_length=2000, null=True)),
                ('plan', models.CharField(blank=True, max_length=2000, null=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
                ('Paciente', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Paciente')),
            ],
            options={
                'verbose_name_plural': 'Pacientes - Expediente - Consulta',
            },
        ),
    ]
