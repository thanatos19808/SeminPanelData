# Generated by Django 2.1.7 on 2019-10-11 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0016_auto_20191011_1447'),
    ]

    operations = [
        migrations.AlterField(
            model_name='catalogo',
            name='sinAcro',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='catalogo',
            name='tipoMuestra',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]