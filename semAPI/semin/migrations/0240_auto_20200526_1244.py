# Generated by Django 2.1.7 on 2020-05-26 17:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0239_auto_20200525_1240'),
    ]

    operations = [
        migrations.RenameField(
            model_name='consulta',
            old_name='tensionnArterialSistole',
            new_name='tensionArterialSistole',
        ),
    ]
