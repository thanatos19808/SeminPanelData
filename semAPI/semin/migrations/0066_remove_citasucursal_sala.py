# Generated by Django 2.1.7 on 2019-11-14 17:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0065_auto_20191113_1256'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='citasucursal',
            name='sala',
        ),
    ]