# Generated by Django 2.1.7 on 2019-12-16 20:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0089_auto_20191216_1246'),
    ]

    operations = [
        migrations.AddField(
            model_name='citasucursal',
            name='nombre_promocion',
            field=models.CharField(blank=True, max_length=45, null=True),
        ),
        migrations.AddField(
            model_name='citasucursal',
            name='promocion',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
