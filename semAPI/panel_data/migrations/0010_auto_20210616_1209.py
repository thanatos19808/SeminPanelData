# Generated by Django 2.1.7 on 2021-06-16 17:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('panel_data', '0009_auto_20210615_1627'),
    ]

    operations = [
        migrations.AlterField(
            model_name='aperturacierrecaja',
            name='monto_final',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='aperturacierrecaja',
            name='monto_inicial',
            field=models.FloatField(null=True),
        ),
    ]
