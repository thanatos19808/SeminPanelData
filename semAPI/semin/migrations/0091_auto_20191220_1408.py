# Generated by Django 2.1.7 on 2019-12-20 20:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0090_auto_20191216_1459'),
    ]

    operations = [
        migrations.CreateModel(
            name='Archivo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url_estudio', models.CharField(blank=True, max_length=200, null=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
                ('Paciente', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Paciente')),
            ],
            options={
                'verbose_name_plural': 'Pacientes - Archivo',
            },
        ),
        migrations.RemoveField(
            model_name='estudio',
            name='Paciente',
        ),
        migrations.RemoveField(
            model_name='estudio',
            name='urlEstudio',
        ),
        migrations.AddField(
            model_name='estudio',
            name='Expediente',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Expediente'),
        ),
    ]
