# Generated by Django 2.1.7 on 2020-04-08 15:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0186_remove_historiaclinica_paciente'),
    ]

    operations = [
        migrations.AddField(
            model_name='historiaclinica',
            name='Paciente',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Paciente'),
        ),
    ]