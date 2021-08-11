# Generated by Django 2.1.7 on 2020-04-03 23:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0173_remove_promocion_imagen_miniatura'),
    ]

    operations = [
        migrations.AddField(
            model_name='primeraencuesta',
            name='Sucursal',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='semin.Sucursal'),
        ),
        migrations.AlterField(
            model_name='primeraencuesta',
            name='Paciente',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='semin.Paciente'),
        ),
    ]
