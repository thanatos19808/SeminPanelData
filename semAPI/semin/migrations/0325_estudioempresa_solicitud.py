# Generated by Django 2.1.7 on 2021-02-12 20:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0324_auto_20210212_1401'),
    ]

    operations = [
        migrations.AddField(
            model_name='estudioempresa',
            name='solicitud',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
