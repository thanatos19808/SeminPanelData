# Generated by Django 2.1.7 on 2021-03-24 22:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0350_auto_20210324_0949'),
    ]

    operations = [
        migrations.AddField(
            model_name='facturacion',
            name='aprovado',
            field=models.CharField(blank=True, max_length=90, null=True),
        ),
        migrations.AlterField(
            model_name='facturacion',
            name='factura_estatus',
            field=models.CharField(choices=[('SOLICITADO', 'SOLICITADO'), ('CORREGIDO', 'CORREGIDO'), ('APROBADO', 'APROBADO'), ('RECHAZADO', 'RECHAZADO')], max_length=10, null=True),
        ),
    ]
