# Generated by Django 2.1.7 on 2021-03-22 18:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0344_auto_20210322_1206'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='fisioterapeuta',
            name='puesto',
        ),
        migrations.AlterField(
            model_name='fisioterapeuta',
            name='apellido_materno',
            field=models.CharField(max_length=45, null=True),
        ),
        migrations.AlterField(
            model_name='fisioterapeuta',
            name='fecha_nacimiento',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='fisioterapeuta',
            name='sexo',
            field=models.CharField(choices=[('masculino', 'masculino'), ('femenino', 'femenino')], max_length=9, null=True),
        ),
    ]