# Generated by Django 2.1.7 on 2020-09-22 18:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0291_versioncliente_descripcion'),
    ]

    operations = [
        migrations.AddField(
            model_name='medico',
            name='token_zoom',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]