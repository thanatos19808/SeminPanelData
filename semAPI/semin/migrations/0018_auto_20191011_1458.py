# Generated by Django 2.1.7 on 2019-10-11 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0017_auto_20191011_1450'),
    ]

    operations = [
        migrations.AlterField(
            model_name='catalogo',
            name='sexo',
            field=models.CharField(choices=[('M', 'M'), ('F', 'F'), ('I', 'I')], max_length=1, null=True),
        ),
    ]
