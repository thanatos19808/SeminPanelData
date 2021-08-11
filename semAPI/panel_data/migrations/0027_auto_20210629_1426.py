# Generated by Django 2.1.7 on 2021-06-29 19:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('panel_data', '0026_auto_20210629_1316'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='useradminpanel',
            name='administrador',
        ),
        migrations.RemoveField(
            model_name='useradminpanel',
            name='puesto',
        ),
        migrations.AddField(
            model_name='useradminpanel',
            name='fecha_nacimiento',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='useradminpanel',
            name='sexo',
            field=models.CharField(choices=[('masculino', 'masculino'), ('femenino', 'femenino')], max_length=9, null=True),
        ),
        migrations.AddField(
            model_name='useradminpanel',
            name='telefono',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='useradminpanel',
            name='nombre',
            field=models.CharField(max_length=90, null=True),
        ),
    ]
