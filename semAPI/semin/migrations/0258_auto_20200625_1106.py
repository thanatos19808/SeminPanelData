# Generated by Django 2.1.7 on 2020-06-25 16:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0257_auto_20200624_1228'),
    ]

    operations = [
        migrations.AddField(
            model_name='medico',
            name='fecha_registro',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='medico',
            name='cedula',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='medico',
            name='estrellas',
            field=models.IntegerField(default=5, null=True),
        ),
    ]
