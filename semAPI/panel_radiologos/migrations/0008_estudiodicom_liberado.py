# Generated by Django 2.1.7 on 2021-01-28 22:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('panel_radiologos', '0007_auto_20210125_1932'),
    ]

    operations = [
        migrations.AddField(
            model_name='estudiodicom',
            name='liberado',
            field=models.BooleanField(default=False),
        ),
    ]
