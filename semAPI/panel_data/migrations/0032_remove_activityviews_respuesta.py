# Generated by Django 2.1.7 on 2021-06-30 17:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('panel_data', '0031_auto_20210630_1138'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='activityviews',
            name='respuesta',
        ),
    ]