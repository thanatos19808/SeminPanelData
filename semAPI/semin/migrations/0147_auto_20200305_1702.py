# Generated by Django 2.1.7 on 2020-03-05 23:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0146_auto_20200304_1145'),
    ]

    operations = [
        migrations.AlterField(
            model_name='facturacion',
            name='email',
            field=models.EmailField(blank=True, max_length=45, null=True),
        ),
    ]
