# Generated by Django 2.1.7 on 2021-04-13 17:41

from django.db import migrations, models
import django.db.models.deletion
import semin.models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0357_auto_20210413_1231'),
    ]

    operations = [
        migrations.CreateModel(
            name='Envio',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nota', models.CharField(blank=True, max_length=150, null=True)),
                ('medio', models.CharField(blank=True, max_length=50, null=True)),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('id_empleado', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Empleado')),
            ],
        ),
        migrations.CreateModel(
            name='Solicitud',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=150, null=True)),
                ('nota', models.CharField(blank=True, max_length=150, null=True)),
                ('id_empleado', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Empleado')),
                ('id_sucursal', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Sucursal')),
            ],
        ),
        migrations.AddField(
            model_name='productos',
            name='imagen',
            field=models.FileField(blank=True, null=True, upload_to='productos/', validators=[semin.models.Productos.validate_file]),
        ),
        migrations.AddField(
            model_name='envio',
            name='id_producto',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Productos'),
        ),
        migrations.AddField(
            model_name='envio',
            name='id_sucursal',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Sucursal'),
        ),
    ]
