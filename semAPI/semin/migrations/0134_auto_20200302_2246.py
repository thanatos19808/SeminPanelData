# Generated by Django 2.1.7 on 2020-03-02 22:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0133_auto_20200302_2238'),
    ]

    operations = [
        migrations.AlterField(
            model_name='facturacion',
            name='apellido_materno',
            field=models.CharField(blank=True, max_length=45, null=True),
        ),
        migrations.AlterField(
            model_name='facturacion',
            name='email',
            field=models.EmailField(blank=True, max_length=45, null=True, unique=True),
        ),
    ]