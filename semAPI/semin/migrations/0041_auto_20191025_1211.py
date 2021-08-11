# Generated by Django 2.1.7 on 2019-10-25 17:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0040_citasucursal_id_pago'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='citasucursal',
            name='descripcion',
        ),
        migrations.AddField(
            model_name='citasucursal',
            name='Paciente',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Paciente'),
        ),
        migrations.AddField(
            model_name='citasucursal',
            name='id_sala',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='citasucursal',
            name='estatus',
            field=models.CharField(choices=[('ACTIVA', 'ACTIVA'), ('CERRADA', 'CERRADA'), ('CANCELADA', 'CANCELADA'), ('ESPERA', 'ESPERA')], max_length=13, null=True),
        ),
        migrations.AlterField(
            model_name='citasucursal',
            name='fecha_cita',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='citasucursal',
            name='hora_final',
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='citasucursal',
            name='hora_inicio',
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='citasucursal',
            name='notas',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='citasucursal',
            name='prueba',
            field=models.CharField(blank=True, max_length=45, null=True),
        ),
        migrations.AlterField(
            model_name='citasucursal',
            name='sala',
            field=models.CharField(choices=[('Cons', 'Cons'), ('US', 'US'), ('RXS', 'RXS'), ('RXC', 'RXC'), ('Masto', 'Masto'), ('EKG', 'EKG'), ('TAC', 'TAC'), ('RM', 'RM'), ('Colpo', 'Colpo'), ('Densi', 'Densi'), ('Cli', 'Cli'), ('Externo', 'Externo')], max_length=45, null=True),
        ),
    ]