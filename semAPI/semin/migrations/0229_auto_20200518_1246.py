# Generated by Django 2.1.7 on 2020-05-18 17:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0228_auto_20200518_1217'),
    ]

    operations = [
        migrations.AddField(
            model_name='historiaclinica',
            name='estadoSalud',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='maxGradoEstudios',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]