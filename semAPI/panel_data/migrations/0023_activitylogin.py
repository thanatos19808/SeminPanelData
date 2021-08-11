# Generated by Django 2.1.7 on 2021-06-29 16:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('panel_data', '0022_auto_20210625_1011'),
    ]

    operations = [
        migrations.CreateModel(
            name='ActivityLogin',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=45, null=True)),
                ('date', models.DateField(null=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Panel Data - Actividades Login',
            },
        ),
    ]
