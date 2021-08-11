# Generated by Django 2.1.7 on 2019-10-25 16:56

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0038_remove_promocion_catalogo'),
    ]

    operations = [
        migrations.RenameField(
            model_name='citasucursal',
            old_name='tipo_estudio',
            new_name='prueba',
        ),
        migrations.RenameField(
            model_name='citasucursal',
            old_name='titulo',
            new_name='sala',
        ),
        migrations.AddField(
            model_name='citasucursal',
            name='categoria',
            field=models.CharField(choices=[('Analisis Clínicos', 'Analisis Clínicos'), ('Ultrasonografía', 'Ultrasonografía'), ('Rayos X', 'Rayos X'), ('Rayos X Contrastados', 'Rayos X Contrastados'), ('Mastografía', 'Mastografía'), ('Papanicolau', 'Papanicolau'), ('Electrocardiograma', 'Electrocardiograma'), ('Tomografía', 'Tomografía'), ('Tomografía Contrastada', 'Tomografía Contrastada'), ('Resonancia Magnética', 'Resonancia Magnética'), ('Resonancia Magnética Contrastada', 'Resonancia Magnética Contrastada'), ('Colposcopía', 'Colposcopía'), ('Densitometría', 'Densitometría'), ('Audiología', 'Audiología'), ('Espirometría', 'Espirometría'), ('Patología', 'Patología'), ('Clínica', 'Clínica')], max_length=45, null=True),
        ),
        migrations.AddField(
            model_name='estudio',
            name='creacion',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='estudio',
            name='ultimaActualizacion',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
