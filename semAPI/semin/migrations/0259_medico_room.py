# Generated by Django 2.1.7 on 2020-06-25 18:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0258_auto_20200625_1106'),
    ]

    operations = [
        migrations.AddField(
            model_name='medico',
            name='room',
            field=models.CharField(blank=True, max_length=60, null=True),
        ),
    ]
