# Generated by Django 2.1.7 on 2021-04-20 20:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0369_carrousel'),
    ]

    operations = [
        migrations.AddField(
            model_name='rehabilitacion',
            name='observaciones',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
