# Generated by Django 2.1.7 on 2019-10-24 18:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0026_remove_diasfestivos_fecha_festividad'),
    ]

    operations = [
        migrations.RenameField(
            model_name='disponibilidadservicio',
            old_name='TAC_1',
            new_name='TACS_1',
        ),
        migrations.RenameField(
            model_name='disponibilidadservicio',
            old_name='TAC_2',
            new_name='TACS_2',
        ),
    ]