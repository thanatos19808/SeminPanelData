# Generated by Django 2.1.7 on 2020-05-05 16:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0218_medico_ranking'),
    ]

    operations = [
        migrations.AddField(
            model_name='medico',
            name='caducidad',
            field=models.DateField(blank=True, null=True),
        ),
    ]
