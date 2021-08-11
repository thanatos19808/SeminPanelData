# Generated by Django 2.1.7 on 2020-06-02 14:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0242_auto_20200527_1311'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tablapermisos',
            name='correoDoctor',
        ),
        migrations.RemoveField(
            model_name='tablapermisos',
            name='externo',
        ),
        migrations.AddField(
            model_name='tablapermisos',
            name='Medico',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Medico'),
        ),
        migrations.AddField(
            model_name='tablapermisos',
            name='email',
            field=models.EmailField(blank=True, max_length=45, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='tablapermisos',
            name='tipo',
            field=models.CharField(blank=True, choices=[('INTERNO', 'INTERNO'), ('EXTERNO', 'EXTERNO')], max_length=9, null=True),
        ),
    ]
