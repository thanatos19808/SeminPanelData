# Generated by Django 2.1.7 on 2020-03-03 19:02

from django.db import migrations
import sortedm2m.fields


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0137_auto_20200303_1901'),
    ]

    operations = [
        migrations.AlterField(
            model_name='facturacion',
            name='CitaSucursal',
            field=sortedm2m.fields.SortedManyToManyField(blank=True, help_text=None, to='semin.CitaSucursal'),
        ),
    ]
