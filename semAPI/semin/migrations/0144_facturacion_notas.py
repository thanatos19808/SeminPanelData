# Generated by Django 2.1.7 on 2020-03-04 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0143_auto_20200304_0839'),
    ]

    operations = [
        migrations.AddField(
            model_name='facturacion',
            name='notas',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
