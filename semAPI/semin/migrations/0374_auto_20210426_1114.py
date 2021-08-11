# Generated by Django 2.1.7 on 2021-04-26 16:14

from django.db import migrations
import sortedm2m.fields


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0373_auto_20210426_1045'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bolsa',
            name='Bolsa_Conocimientos',
        ),
        migrations.AddField(
            model_name='bolsa_conocimientos',
            name='Bolsa',
            field=sortedm2m.fields.SortedManyToManyField(help_text=None, to='semin.Bolsa'),
        ),
    ]
