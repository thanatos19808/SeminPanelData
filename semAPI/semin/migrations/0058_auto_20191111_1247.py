# Generated by Django 2.1.7 on 2019-11-11 18:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0057_citasucursal_precioventa'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paciente',
            name='email',
            field=models.EmailField(max_length=45, null=True, unique=True),
        ),
    ]
