# Generated by Django 2.1.7 on 2020-04-08 15:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0188_auto_20200408_1052'),
    ]

    operations = [
        migrations.CreateModel(
            name='HistoriaClinica',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('peso', models.FloatField(blank=True, null=True)),
                ('talla', models.FloatField(blank=True, null=True)),
                ('indiceMasaCorporal', models.FloatField(blank=True, null=True)),
                ('frecuenciaCardiaca', models.IntegerField(blank=True, null=True)),
                ('frecuenciaRespiratoria', models.IntegerField(blank=True, null=True)),
                ('presionArterialSistole', models.IntegerField(blank=True, null=True)),
                ('presionArterialDiastole', models.IntegerField(blank=True, null=True)),
                ('sistemaNeurologico', models.CharField(blank=True, max_length=1000, null=True)),
                ('sistemaTegumentario', models.CharField(blank=True, max_length=1000, null=True)),
                ('sistemaMusculoEsqueletico', models.CharField(blank=True, max_length=1000, null=True)),
                ('sistemaRespiratorio', models.CharField(blank=True, max_length=1000, null=True)),
                ('sistemaDigestivo', models.CharField(blank=True, max_length=1000, null=True)),
                ('sistemaUrinario', models.CharField(blank=True, max_length=1000, null=True)),
                ('sistemaReproductor', models.CharField(blank=True, max_length=1000, null=True)),
                ('sistemasSentidos', models.CharField(blank=True, max_length=1000, null=True)),
                ('temperatura', models.FloatField(blank=True, null=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
                ('Paciente', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Paciente')),
            ],
            options={
                'verbose_name_plural': 'Pacientes - Historia Clinica',
            },
        ),
    ]
