# Generated by Django 2.1.7 on 2019-11-04 19:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0052_auto_20191104_1334'),
    ]

    operations = [
        migrations.AlterField(
            model_name='catalogo',
            name='sala',
            field=models.CharField(blank=True, choices=[('Cons', 'Cons'), ('US', 'US'), ('RXS', 'RXS'), ('RXC', 'RXC'), ('Masto', 'Masto'), ('EKG', 'EKG'), ('TAC', 'TAC'), ('RM', 'RM'), ('Colpo', 'Colpo'), ('Densi', 'Densi'), ('Cli', 'Cli'), ('Externo', 'Externo')], max_length=45, null=True),
        ),
        migrations.AlterField(
            model_name='citasucursal',
            name='sala',
            field=models.CharField(choices=[('Cons', 'Cons'), ('US', 'US'), ('RXS', 'RXS'), ('RXC', 'RXC'), ('Masto', 'Masto'), ('EKG', 'EKG'), ('TAC', 'TAC'), ('RM', 'RM'), ('Colpo', 'Colpo'), ('Densi', 'Densi'), ('Cli', 'Cli'), ('Externo', 'Externo')], max_length=45, null=True),
        ),
    ]
