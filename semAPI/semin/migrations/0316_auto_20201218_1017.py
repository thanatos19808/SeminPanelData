# Generated by Django 2.1.7 on 2020-12-18 16:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0315_medico_estrellasarray'),
    ]

    operations = [
        migrations.AlterField(
            model_name='loginclientes',
            name='origen',
            field=models.CharField(blank=True, choices=[('APP_VIDEO', 'APP_VIDEO'), ('APP_DOC', 'APP_DOC'), ('WEB', 'WEB')], max_length=10, null=True),
        ),
    ]
