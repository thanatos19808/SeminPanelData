# Generated by Django 2.1.7 on 2020-03-03 18:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0135_auto_20200303_1830'),
    ]

    operations = [
        migrations.AddField(
            model_name='facturacion',
            name='Paciente',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Paciente'),
        ),
    ]