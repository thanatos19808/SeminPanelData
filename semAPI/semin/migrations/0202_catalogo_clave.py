# Generated by Django 2.1.7 on 2020-04-14 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0201_auto_20200413_1246'),
    ]

    operations = [
        migrations.AddField(
            model_name='catalogo',
            name='clave',
            field=models.CharField(max_length=200, null=True),
        ),
    ]