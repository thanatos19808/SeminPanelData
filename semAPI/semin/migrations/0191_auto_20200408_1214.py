# Generated by Django 2.1.7 on 2020-04-08 17:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0190_auto_20200408_1212'),
    ]

    operations = [
        migrations.AlterField(
            model_name='facturacion',
            name='Paciente',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Paciente'),
        ),
    ]
