# Generated by Django 2.1.7 on 2020-02-18 17:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0126_auto_20200218_0912'),
    ]

    operations = [
        migrations.AddField(
            model_name='citasucursal',
            name='estatus_rembolso',
            field=models.CharField(blank=True, choices=[('SOLICITADO', 'SOLICITADO'), ('APROVADO', 'APROVADO'), ('RECHAZADO', 'RECHAZADO')], max_length=10, null=True),
        ),
    ]