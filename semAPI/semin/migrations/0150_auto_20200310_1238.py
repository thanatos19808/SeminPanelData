# Generated by Django 2.1.7 on 2020-03-10 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0149_citasucursal_app_movil'),
    ]

    operations = [
        migrations.AlterField(
            model_name='citasucursal',
            name='razon_rembolso',
            field=models.CharField(blank=True, choices=[('No pude hacer el estudio por no cumplir las condiciones requeridas', 'No pude hacer el estudio por no cumplir las condiciones requeridas'), ('Ya no requiero el estudio', 'Ya no requiero el estudio'), ('Requiero un cambio de estudio', 'Requiero un cambio de estudio'), ('No me gusto el servicio', 'No me gusto el servicio'), ('El personal no tiene buena actitud', 'El personal no tiene buena actitud'), ('Requiero un descuento adicional', 'Requiero un descuento adicional')], max_length=70, null=True),
        ),
    ]
