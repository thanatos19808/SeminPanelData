# Generated by Django 2.1.7 on 2020-03-03 22:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0139_auto_20200303_1537'),
    ]

    operations = [
        migrations.AddField(
            model_name='facturacion',
            name='factura_estatus',
            field=models.CharField(blank=True, choices=[('SOLICITADO', 'SOLICITADO'), ('APROBADO', 'APROBADO'), ('RECHAZADO', 'RECHAZADO')], default='SOLICITAD0', max_length=10, null=True),
        ),
    ]
