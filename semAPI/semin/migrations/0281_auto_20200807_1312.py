# Generated by Django 2.1.7 on 2020-08-07 18:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0280_auto_20200806_1043'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paciente',
            name='tipo_vivienda',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
