# Generated by Django 2.1.7 on 2019-11-11 22:43

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('semin', '0058_auto_20191111_1247'),
    ]

    operations = [
        migrations.AddField(
            model_name='empleado',
            name='editors',
            field=models.ManyToManyField(blank=True, related_name='operadores', to=settings.AUTH_USER_MODEL),
        ),
    ]
