# Generated by Django 2.1.7 on 2020-06-26 18:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0260_auto_20200626_0927'),
    ]

    operations = [
        migrations.AddField(
            model_name='medico',
            name='subespecialidad',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='catalogo',
            name='beneficio',
            field=models.CharField(max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='catalogo',
            name='indicacionesPreExamen',
            field=models.CharField(max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='catalogo',
            name='otrasIndicaciones',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='catalogo',
            name='prueba',
            field=models.CharField(max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='catalogo',
            name='sinAcro',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='catalogo',
            name='tiempoEntrega',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='catalogo',
            name='tipoMuestra',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
