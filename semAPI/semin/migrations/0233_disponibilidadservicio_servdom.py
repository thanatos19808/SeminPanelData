# Generated by Django 2.1.7 on 2020-05-18 20:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0232_auto_20200518_1300'),
    ]

    operations = [
        migrations.AddField(
            model_name='disponibilidadservicio',
            name='ServDom',
            field=models.IntegerField(default=0),
        ),
    ]