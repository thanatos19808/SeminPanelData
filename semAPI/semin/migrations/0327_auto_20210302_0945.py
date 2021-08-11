# Generated by Django 2.1.7 on 2021-03-02 15:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0326_estudioempresa_caducidad'),
    ]

    operations = [
        migrations.CreateModel(
            name='RegistroVideollamada',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_cita', models.DateField(null=True)),
                ('hora_inicio', models.TimeField(null=True)),
                ('hora_final', models.TimeField(null=True)),
                ('creador', models.CharField(max_length=90, null=True)),
                ('editor', models.CharField(max_length=90, null=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
                ('Medico', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='semin.Medico')),
                ('Paciente', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='semin.Paciente')),
            ],
            options={
                'verbose_name_plural': 'Registro - Videollamadas',
            },
        ),
        migrations.AlterModelOptions(
            name='historicopago',
            options={'verbose_name_plural': 'Registro - Historico de Pagos'},
        ),
        migrations.AlterModelOptions(
            name='loginclientes',
            options={'verbose_name_plural': 'Registro - Login Clientes'},
        ),
    ]