# Generated by Django 2.1.7 on 2021-03-18 21:41

from django.db import migrations, models
import semin.models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0338_auto_20210317_2035'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rehabilitacion',
            name='carnet',
            field=models.FileField(null=True, upload_to='rehabilitacion/adultos/', validators=[semin.models.Rehabilitacion.validate_file]),
        ),
        migrations.AlterField(
            model_name='rehabilitacion',
            name='constancia_vigencia',
            field=models.FileField(null=True, upload_to='rehabilitacion/adultos/', validators=[semin.models.Rehabilitacion.validate_file]),
        ),
        migrations.AlterField(
            model_name='rehabilitacion',
            name='hoja_430',
            field=models.FileField(null=True, upload_to='rehabilitacion/adultos/', validators=[semin.models.Rehabilitacion.validate_file]),
        ),
        migrations.AlterField(
            model_name='rehabilitacion',
            name='identificacion',
            field=models.FileField(null=True, upload_to='rehabilitacion/adultos/', validators=[semin.models.Rehabilitacion.validate_file]),
        ),
        migrations.AlterField(
            model_name='rehabilitacion',
            name='orden_trabajo',
            field=models.FileField(null=True, upload_to='rehabilitacion/adultos/', validators=[semin.models.Rehabilitacion.validate_file]),
        ),
    ]