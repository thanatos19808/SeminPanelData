# Generated by Django 2.1.7 on 2021-05-04 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0388_auto_20210429_1212'),
    ]

    operations = [
        migrations.AddField(
            model_name='promocionticket',
            name='prueba',
            field=models.CharField(max_length=1000, null=True),
        ),
    ]
