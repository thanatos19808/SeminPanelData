# Generated by Django 2.1.7 on 2019-12-24 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0100_estudio_filedicom'),
    ]

    operations = [
        migrations.AlterField(
            model_name='estudio',
            name='fileDicom',
            field=models.FileField(blank=True, null=True, upload_to='estudios/'),
        ),
    ]
