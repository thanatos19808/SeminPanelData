# Generated by Django 2.1.7 on 2020-08-31 16:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0283_auto_20200828_0849'),
    ]

    operations = [
        migrations.CreateModel(
            name='CallCenter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo', models.CharField(choices=[('CALIDAD', 'CALIDAD'), ('RECIBIDA', 'RECIBIDA')], max_length=9, null=True)),
                ('telefono', models.IntegerField(null=True)),
                ('interes', models.CharField(max_length=500, null=True)),
                ('nombre', models.CharField(blank=True, max_length=90, null=True)),
                ('apellido_paterno', models.CharField(blank=True, max_length=45, null=True)),
                ('apellido_materno', models.CharField(blank=True, max_length=45, null=True)),
                ('email', models.EmailField(blank=True, max_length=45, null=True)),
                ('fecha_nacimiento', models.DateField(blank=True, null=True)),
                ('experiencia', models.CharField(max_length=2000, null=True)),
                ('creador', models.CharField(blank=True, max_length=90, null=True)),
                ('editor', models.CharField(blank=True, max_length=90, null=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Semin - Facturacion',
            },
        ),
    ]
