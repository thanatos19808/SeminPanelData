# Generated by Django 2.1.7 on 2019-10-24 20:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0029_auto_20191024_1522'),
    ]

    operations = [
        migrations.AddField(
            model_name='disponibilidadservicio',
            name='Cons_x',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
