# Generated by Django 2.1.7 on 2021-04-14 21:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0365_auto_20210414_1542'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rehabilitacion',
            name='numero_firmas',
            field=models.CharField(blank=True, default='0', max_length=3, null=True),
        ),
    ]
