# Generated by Django 2.1.7 on 2020-11-09 18:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0304_paciente_landing'),
    ]

    operations = [
        migrations.AddField(
            model_name='comentarios',
            name='notas',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='quejassugerencias',
            name='notas',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]