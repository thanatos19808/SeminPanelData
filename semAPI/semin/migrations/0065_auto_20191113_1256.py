# Generated by Django 2.1.7 on 2019-11-13 18:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0064_auto_20191113_1242'),
    ]

    operations = [
        migrations.RenameField(
            model_name='disponibilidadservicio',
            old_name='MASTO',
            new_name='Masto',
        ),
        migrations.RenameField(
            model_name='disponibilidadservicio',
            old_name='RX',
            new_name='RXS',
        ),
    ]
