# Generated by Django 2.1.7 on 2020-06-23 21:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0254_auto_20200623_1322'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medico',
            name='estrellas',
            field=models.IntegerField(default=3, max_length=5, null=True),
        ),
        migrations.AlterField(
            model_name='medico',
            name='ranking',
            field=models.IntegerField(default=500, max_length=1000000, null=True),
        ),
    ]