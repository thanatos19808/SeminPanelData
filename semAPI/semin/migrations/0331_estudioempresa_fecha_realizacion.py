# Generated by Django 2.1.7 on 2021-03-09 21:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0330_auto_20210302_1631'),
    ]

    operations = [
        migrations.AddField(
            model_name='estudioempresa',
            name='fecha_realizacion',
            field=models.DateField(null=True),
        ),
    ]
