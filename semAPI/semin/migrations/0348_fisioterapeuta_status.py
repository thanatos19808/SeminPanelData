# Generated by Django 2.1.7 on 2021-03-24 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0347_fondologin'),
    ]

    operations = [
        migrations.AddField(
            model_name='fisioterapeuta',
            name='status',
            field=models.CharField(choices=[('Correcto', 'Correcto'), ('Incorrecto', 'Incorrecto'), ('Pendiente', 'Pendiente')], max_length=20, null=True),
        ),
    ]
