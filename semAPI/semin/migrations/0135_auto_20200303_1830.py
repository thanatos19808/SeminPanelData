# Generated by Django 2.1.7 on 2020-03-03 18:30

from django.db import migrations
import sortedm2m.fields


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0134_auto_20200302_2246'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='facturacion',
            name='CitaSucursal',
        ),
        migrations.AddField(
            model_name='facturacion',
            name='CitaSucursal',
            field=sortedm2m.fields.SortedManyToManyField(help_text=None, to='semin.CitaSucursal'),
        ),
    ]
