# Generated by Django 2.1.7 on 2020-04-22 20:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0209_auto_20200422_1447'),
    ]

    operations = [
        migrations.CreateModel(
            name='CitaMedico',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_cita', models.DateField(blank=True, null=True)),
                ('hora_inicio', models.TimeField(blank=True, null=True)),
                ('hora_final', models.TimeField(blank=True, null=True)),
                ('id_sala', models.IntegerField(blank=True, null=True)),
                ('titulo', models.CharField(blank=True, max_length=500, null=True)),
                ('costo', models.FloatField(blank=True, null=True)),
                ('notas', models.CharField(blank=True, max_length=500, null=True)),
                ('estatus', models.CharField(choices=[('ACTIVA', 'ACTIVA'), ('CERRADA', 'CERRADA'), ('CANCELADA', 'CANCELADA')], max_length=13, null=True)),
                ('creador', models.CharField(blank=True, max_length=90, null=True)),
                ('editor', models.CharField(blank=True, max_length=90, null=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
                ('Medico', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Medico')),
                ('Paciente', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='semin.Paciente')),
            ],
            options={
                'verbose_name_plural': 'Semin - Médicos - Citas',
            },
        ),
    ]
