# Generated by Django 2.1.7 on 2019-10-30 16:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0045_auto_20191028_1339'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='titulo',
        ),
    ]
