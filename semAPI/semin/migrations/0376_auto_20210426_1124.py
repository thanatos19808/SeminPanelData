# Generated by Django 2.1.7 on 2021-04-26 16:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0375_auto_20210426_1117'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bolsa',
            name='Bolsa_Conocimientos',
        ),
        migrations.AddField(
            model_name='bolsa',
            name='Bolsa_Conocimientos',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Bolsa_Conocimientos'),
        ),
    ]
