# Generated by Django 2.1.7 on 2021-07-05 19:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0403_auto_20210705_1452'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='tipo',
            field=models.CharField(blank=True, choices=[('Paciente', 'Paciente'), ('Operador', 'Operador'), ('Imagenologia', 'Imagenologia'), ('Fisioterapeuta', 'Fisioterapeuta'), ('Almacenista', 'Almacenista'), ('Medico', 'Medico'), ('Administrador', 'Administrador'), ('Admin_panel', 'Admin_panel'), ('Auditor_panel', 'Auditor_panel'), ('administrador_editor', 'administrador_editor'), ('administrador_titular', 'administrador_titular')], max_length=14, null=True),
        ),
    ]
