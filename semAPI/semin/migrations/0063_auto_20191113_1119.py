# Generated by Django 2.1.7 on 2019-11-13 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0062_auto_20191113_1108'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tiemposervicio',
            old_name='Analisis',
            new_name='Esp',
        ),
        migrations.AddField(
            model_name='tiemposervicio',
            name='Sang',
            field=models.IntegerField(default=0),
        ),
    ]