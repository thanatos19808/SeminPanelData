# Generated by Django 2.1.7 on 2020-05-26 21:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0240_auto_20200526_1244'),
    ]

    operations = [
        migrations.AddField(
            model_name='consulta',
            name='Medico',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='semin.Medico'),
        ),
    ]
