# Generated by Django 2.1.7 on 2019-12-11 16:19

from django.db import migrations
import sortedm2m.fields


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0079_remove_promocion_catalogo'),
    ]

    operations = [
        migrations.AddField(
            model_name='promocion',
            name='Catalogo',
            field=sortedm2m.fields.SortedManyToManyField(help_text=None, to='semin.Catalogo'),
        ),
    ]
