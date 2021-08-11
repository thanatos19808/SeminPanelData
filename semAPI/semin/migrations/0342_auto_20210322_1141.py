# Generated by Django 2.1.7 on 2021-03-22 17:41

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('semin', '0341_auto_20210322_1139'),
    ]

    operations = [
        migrations.CreateModel(
            name='Fisioterapeuta',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=90, null=True)),
                ('apellido_paterno', models.CharField(max_length=45, null=True)),
                ('apellido_materno', models.CharField(blank=True, max_length=45, null=True)),
                ('fecha_nacimiento', models.DateField(blank=True, null=True)),
                ('sexo', models.CharField(blank=True, choices=[('masculino', 'masculino'), ('femenino', 'femenino')], max_length=9, null=True)),
                ('puesto', models.CharField(max_length=90, null=True)),
                ('telefono', models.IntegerField(blank=True, null=True)),
                ('email', models.EmailField(blank=True, max_length=45, null=True, unique=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Registro - Fisioterapeuta ',
            },
        ),
        migrations.AlterModelOptions(
            name='empleado',
            options={'verbose_name_plural': 'Semin - Empleados'},
        ),
        migrations.AddField(
            model_name='empleado',
            name='auditor',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AddField(
            model_name='empleado',
            name='directivo',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AddField(
            model_name='empleado',
            name='editors',
            field=models.ManyToManyField(blank=True, related_name='operadores', to=settings.AUTH_USER_MODEL),
        ),
    ]