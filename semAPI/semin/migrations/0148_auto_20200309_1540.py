# Generated by Django 2.1.7 on 2020-03-09 21:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0147_auto_20200305_1702'),
    ]

    operations = [
        migrations.AddField(
            model_name='facturacion',
            name='impresion',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AddField(
            model_name='promocion',
            name='imagen_miniatura',
            field=models.ImageField(null=True, upload_to='images/promociones'),
        ),
    ]
