# Generated by Django 2.1.7 on 2020-11-18 15:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0305_auto_20201109_1241'),
    ]

    operations = [
        migrations.AddField(
            model_name='paciente',
            name='promocion_registro',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
