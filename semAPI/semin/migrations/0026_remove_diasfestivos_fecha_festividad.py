# Generated by Django 2.1.7 on 2019-10-24 17:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0025_auto_20191024_1211'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='diasfestivos',
            name='fecha_festividad',
        ),
    ]
