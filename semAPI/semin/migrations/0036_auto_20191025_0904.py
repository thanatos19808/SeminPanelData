# Generated by Django 2.1.7 on 2019-10-25 14:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0035_catalogo_sala'),
    ]

    operations = [
        migrations.AlterField(
            model_name='catalogo',
            name='sala',
            field=models.CharField(choices=[('Cons', 'Cons'), ('US', 'US'), ('RXS', 'RXS'), ('RXC', 'RXC'), ('Masto', 'Masto'), ('EKG', 'EKG'), ('TAC', 'TAC'), ('RM', 'RM'), ('Colpo', 'Colpo'), ('Densi', 'Densi'), ('Cli', 'Cli'), ('Externo', 'Externo')], max_length=45, null=True),
        ),
    ]
