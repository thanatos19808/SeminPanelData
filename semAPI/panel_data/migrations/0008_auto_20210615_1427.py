# Generated by Django 2.1.7 on 2021-06-15 19:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0401_auto_20210615_1230'),
        ('panel_data', '0007_auto_20210615_1243'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cajerooperador',
            name='apellido_materno',
        ),
        migrations.RemoveField(
            model_name='cajerooperador',
            name='apellido_paterno',
        ),
        migrations.RemoveField(
            model_name='cajerooperador',
            name='email',
        ),
        migrations.RemoveField(
            model_name='cajerooperador',
            name='fecha_nacimiento',
        ),
        migrations.RemoveField(
            model_name='cajerooperador',
            name='nombre',
        ),
        migrations.RemoveField(
            model_name='cajerooperador',
            name='sexo',
        ),
        migrations.RemoveField(
            model_name='cajerooperador',
            name='telefono',
        ),
        migrations.AddField(
            model_name='cajerooperador',
            name='cajero',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Empleado'),
        ),
    ]
