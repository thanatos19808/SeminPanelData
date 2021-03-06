# Generated by Django 2.1.7 on 2021-02-10 22:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0317_auto_20210115_1137'),
    ]

    operations = [
        migrations.CreateModel(
            name='Empresa',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombreEmpresa', models.CharField(max_length=200)),
                ('creador', models.CharField(blank=True, max_length=90, null=True)),
                ('editor', models.CharField(blank=True, max_length=90, null=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Semin - Empresas',
            },
        ),
    ]
