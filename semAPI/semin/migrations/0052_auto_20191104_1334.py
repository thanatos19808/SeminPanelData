# Generated by Django 2.1.7 on 2019-11-04 19:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0051_delete_diasfestivos'),
    ]

    operations = [
        migrations.AlterField(
            model_name='citasucursal',
            name='sala',
            field=models.CharField(blank=True, choices=[('Cons', 'Cons'), ('US', 'US'), ('RXS', 'RXS'), ('RXC', 'RXC'), ('Masto', 'Masto'), ('EKG', 'EKG'), ('TAC', 'TAC'), ('RM', 'RM'), ('Colpo', 'Colpo'), ('Densi', 'Densi'), ('Cli', 'Cli'), ('Externo', 'Externo')], max_length=45, null=True),
        ),
    ]
