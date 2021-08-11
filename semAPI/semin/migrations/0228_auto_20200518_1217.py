# Generated by Django 2.1.7 on 2020-05-18 17:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0227_auto_20200515_1532'),
    ]

    operations = [
        migrations.AddField(
            model_name='historiaclinica',
            name='calle',
            field=models.CharField(blank=True, max_length=90, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='colonia',
            field=models.CharField(blank=True, max_length=45, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='cp',
            field=models.CharField(blank=True, max_length=5, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='email',
            field=models.EmailField(max_length=45, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='entidad_nacimiento',
            field=models.CharField(blank=True, choices=[('Aguascalientes', 'Aguascalientes'), ('Baja California', 'Baja California'), ('Baja California Sur', 'Baja California Sur'), ('Campeche', 'Campeche'), ('CDMX', 'CDMX'), ('Chihuahua', 'Chihuahua'), ('Chiapas', 'Chiapas'), ('Coahuila', 'Coahuila'), ('Colima', 'Colima'), ('Durango', 'Durango'), ('Guanajuato', 'Guanajuato'), ('Guerrero', 'Guerrero'), ('Hidalgo', 'Hidalgo'), ('Jalisco', 'Jalisco'), ('México', 'México'), ('Michoacán', 'Michoacán'), ('Morelos', 'Morelos'), ('Nayarit', 'Nayarit'), ('Nuevo León', 'Nuevo León'), ('Oaxaca', 'Oaxaca'), ('Puebla', 'Puebla'), ('Querétaro', 'Querétaro'), ('Quintana Ro', 'Quintana Ro'), ('San Luis Potosí', 'San Luis Potosí'), ('Sinaloa', 'Sinaloa'), ('Sonora', 'Sonora'), ('Tabasco', 'Tabasco'), ('Tamaulipas', 'Tamaulipas'), ('Tlaxcala', 'Tlaxcala'), ('Veracruz', 'Veracruz'), ('Yucatán', 'Yucatán'), ('Zacatecas', 'Zacatecas')], max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='estado',
            field=models.CharField(blank=True, choices=[('Aguascalientes', 'Aguascalientes'), ('Baja California', 'Baja California'), ('Baja California Sur', 'Baja California Sur'), ('Campeche', 'Campeche'), ('CDMX', 'CDMX'), ('Chihuahua', 'Chihuahua'), ('Chiapas', 'Chiapas'), ('Coahuila', 'Coahuila'), ('Colima', 'Colima'), ('Durango', 'Durango'), ('Guanajuato', 'Guanajuato'), ('Guerrero', 'Guerrero'), ('Hidalgo', 'Hidalgo'), ('Jalisco', 'Jalisco'), ('México', 'México'), ('Michoacán', 'Michoacán'), ('Morelos', 'Morelos'), ('Nayarit', 'Nayarit'), ('Nuevo León', 'Nuevo León'), ('Oaxaca', 'Oaxaca'), ('Puebla', 'Puebla'), ('Querétaro', 'Querétaro'), ('Quintana Ro', 'Quintana Ro'), ('San Luis Potosí', 'San Luis Potosí'), ('Sinaloa', 'Sinaloa'), ('Sonora', 'Sonora'), ('Tabasco', 'Tabasco'), ('Tamaulipas', 'Tamaulipas'), ('Tlaxcala', 'Tlaxcala'), ('Veracruz', 'Veracruz'), ('Yucatán', 'Yucatán'), ('Zacatecas', 'Zacatecas')], max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='estadoCivil',
            field=models.CharField(blank=True, choices=[('Soltero', 'Soltero'), ('Casado', 'Casado'), ('Concubinato', 'Concubinato'), ('Viudo', 'Viudo'), ('Divorciado', 'Divorciado'), ('Separado', 'Separado')], max_length=12, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='hijos',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='localidad',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='municipio',
            field=models.CharField(blank=True, max_length=45, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='numHijos',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='num_exterior',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='num_interior',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='ocupacion',
            field=models.CharField(blank=True, max_length=90, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='religion',
            field=models.CharField(blank=True, max_length=45, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='telefonoCasa',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='telefonoCelular',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='historiaclinica',
            name='telefonoOficina',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]