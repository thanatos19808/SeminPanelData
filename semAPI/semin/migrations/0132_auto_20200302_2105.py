# Generated by Django 2.1.7 on 2020-03-02 21:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0131_auto_20200302_2000'),
    ]

    operations = [
        migrations.CreateModel(
            name='Facturacion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(blank=True, max_length=90, null=True)),
                ('apellido_paterno', models.CharField(max_length=45, null=True)),
                ('apellido_materno', models.CharField(max_length=45, null=True)),
                ('tipo_rfc', models.CharField(blank=True, choices=[('FISICA', 'FISICA'), ('MORAL', 'MORAL')], max_length=6, null=True)),
                ('rfc', models.CharField(blank=True, max_length=15, null=True, unique=True)),
                ('creador', models.CharField(blank=True, max_length=90, null=True)),
                ('editor', models.CharField(blank=True, max_length=90, null=True)),
                ('creacion', models.DateTimeField(auto_now_add=True)),
                ('ultimaActualizacion', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Semin - Facturacion',
            },
        ),
        migrations.RemoveField(
            model_name='citasucursal',
            name='apellido_materno',
        ),
        migrations.RemoveField(
            model_name='citasucursal',
            name='apellido_paterno',
        ),
        migrations.RemoveField(
            model_name='citasucursal',
            name='nombre',
        ),
        migrations.RemoveField(
            model_name='citasucursal',
            name='rfc',
        ),
        migrations.RemoveField(
            model_name='citasucursal',
            name='tipo_rfc',
        ),
        migrations.AddField(
            model_name='facturacion',
            name='CitaSucursal',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.CitaSucursal'),
        ),
    ]
