# Generated by Django 2.1.7 on 2021-06-08 19:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('panel_data', '0002_auto_20210608_1452'),
    ]

    operations = [
        migrations.AddField(
            model_name='ventadespartamento',
            name='tipo',
            field=models.CharField(choices=[('PARTICULAR', 'PARTICULAR'), ('EMPRESA', 'EMPRESA')], max_length=45, null=True),
        ),
    ]