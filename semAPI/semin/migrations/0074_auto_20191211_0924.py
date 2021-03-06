# Generated by Django 2.1.7 on 2019-12-11 15:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0073_auto_20191209_1308'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='promocion',
            options={'verbose_name_plural': 'Semin - Catálogo de Promociónes'},
        ),
        migrations.AddField(
            model_name='promocion',
            name='imagen',
            field=models.ImageField(blank=True, null=True, upload_to='images/promociones'),
        ),
        migrations.AlterField(
            model_name='promocion',
            name='descripcion',
            field=models.CharField(max_length=400, null=True),
        ),
        migrations.AlterField(
            model_name='promocion',
            name='titulo',
            field=models.CharField(max_length=90, null=True),
        ),
    ]
