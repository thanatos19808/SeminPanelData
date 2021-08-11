# Generated by Django 2.1.7 on 2020-05-15 14:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0223_pagoopenpay'),
    ]

    operations = [
        migrations.AddField(
            model_name='pagoopenpay',
            name='citaSucursal',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.CitaSucursal'),
        ),
        migrations.AlterField(
            model_name='pagoopenpay',
            name='create_time',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='pagoopenpay',
            name='environment',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='pagoopenpay',
            name='id_pay',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='pagoopenpay',
            name='intent',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='pagoopenpay',
            name='paypal_sdk_version',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='pagoopenpay',
            name='platform',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='pagoopenpay',
            name='product_name',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='pagoopenpay',
            name='response',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='pagoopenpay',
            name='response_type',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='pagoopenpay',
            name='state',
            field=models.CharField(max_length=500, null=True),
        ),
    ]
