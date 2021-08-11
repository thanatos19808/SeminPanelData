# Generated by Django 2.1.7 on 2020-04-23 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0210_citamedico'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='citamedico',
            name='id_sala',
        ),
        migrations.AddField(
            model_name='citamedico',
            name='tipo',
            field=models.CharField(choices=[('AGENDADA', 'AGENDADA'), ('VIRTUAL', 'VIRTUAL')], max_length=9, null=True),
        ),
        migrations.AddField(
            model_name='medico',
            name='descripcion',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='medico',
            name='hora_apertura',
            field=models.TimeField(null=True),
        ),
        migrations.AddField(
            model_name='medico',
            name='hora_apertura_dom',
            field=models.TimeField(null=True),
        ),
        migrations.AddField(
            model_name='medico',
            name='hora_apertura_sab',
            field=models.TimeField(null=True),
        ),
        migrations.AddField(
            model_name='medico',
            name='hora_cierre',
            field=models.TimeField(null=True),
        ),
        migrations.AddField(
            model_name='medico',
            name='hora_cierre_dom',
            field=models.TimeField(null=True),
        ),
        migrations.AddField(
            model_name='medico',
            name='hora_cierre_sab',
            field=models.TimeField(null=True),
        ),
        migrations.AlterField(
            model_name='citamedico',
            name='fecha_cita',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='citamedico',
            name='hora_final',
            field=models.TimeField(null=True),
        ),
        migrations.AlterField(
            model_name='citamedico',
            name='hora_inicio',
            field=models.TimeField(null=True),
        ),
    ]