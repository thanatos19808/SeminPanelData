# Generated by Django 2.1.7 on 2020-07-06 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0267_auto_20200703_1913'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medico',
            name='verificado',
            field=models.CharField(choices=[('PENDIENTE', 'PENDIENTE'), ('APROBADO', 'APROBADO'), ('RECHAZADO', 'RECHAZADO')], default='PENDIENTE', max_length=11, null=True),
        ),
    ]
