# Generated by Django 2.1.7 on 2020-08-05 18:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0277_cosnsultasclientes'),
    ]

    operations = [
        migrations.AddField(
            model_name='cosnsultasclientes',
            name='origen',
            field=models.CharField(blank=True, choices=[('APP', 'APP'), ('WEB', 'WEB'), ('AGENDA', 'AGENDA'), ('BUSCADOR', 'BUSCADOR')], max_length=10, null=True),
        ),
    ]