# Generated by Django 2.1.7 on 2019-12-12 23:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0085_auto_20191212_1703'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='promocion',
            name='indicacionesPreExamen',
        ),
    ]