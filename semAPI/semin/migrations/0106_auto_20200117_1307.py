# Generated by Django 2.1.7 on 2020-01-17 19:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0105_auto_20200117_1249'),
    ]

    operations = [
        migrations.AlterField(
            model_name='catalogo',
            name='sala',
            field=models.CharField(blank=True, choices=[('Sang', 'Sang'), ('Esp', 'Esp'), ('US', 'US'), ('RXS', 'RXS'), ('RXC', 'RXC'), ('Masto', 'Masto'), ('EKG', 'EKG'), ('TAC', 'TAC'), ('RM', 'RM'), ('Colpo', 'Colpo'), ('Densi', 'Densi'), ('Cli', 'Cli'), ('Card', 'Card'), ('Cons', 'Cons'), ('Externo', 'Externo')], max_length=45, null=True),
        ),
    ]