# Generated by Django 2.1.7 on 2020-09-21 14:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0290_versioncliente'),
    ]

    operations = [
        migrations.AddField(
            model_name='versioncliente',
            name='descripcion',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]