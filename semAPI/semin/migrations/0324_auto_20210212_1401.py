# Generated by Django 2.1.7 on 2021-02-12 20:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0323_auto_20210212_1227'),
    ]

    operations = [
        migrations.AlterField(
            model_name='estudioempresa',
            name='password',
            field=models.CharField(max_length=14),
        ),
        migrations.AlterField(
            model_name='estudioempresa',
            name='usuario',
            field=models.CharField(max_length=14),
        ),
    ]