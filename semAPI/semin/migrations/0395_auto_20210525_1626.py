# Generated by Django 2.1.7 on 2021-05-25 21:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0394_auto_20210514_0951'),
    ]

    operations = [
        migrations.AlterField(
            model_name='facturacion',
            name='tipo_rfc',
            field=models.CharField(blank=True, choices=[('FISICA', 'FISICA'), ('MORAL', 'MORAL')], max_length=6, null=True),
        ),
    ]
