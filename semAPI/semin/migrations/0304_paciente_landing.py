# Generated by Django 2.1.7 on 2020-11-09 18:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0303_auto_20201021_1134'),
    ]

    operations = [
        migrations.AddField(
            model_name='paciente',
            name='landing',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]