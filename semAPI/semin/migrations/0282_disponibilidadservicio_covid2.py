# Generated by Django 2.1.7 on 2020-08-18 14:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0281_auto_20200807_1312'),
    ]

    operations = [
        migrations.AddField(
            model_name='disponibilidadservicio',
            name='Covid2',
            field=models.IntegerField(default=0),
        ),
    ]
