# Generated by Django 2.1.7 on 2019-10-23 13:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0021_auto_20191022_1710'),
    ]

    operations = [
        migrations.AddField(
            model_name='sucursal',
            name='estacionamiento',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
