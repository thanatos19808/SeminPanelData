# Generated by Django 2.1.7 on 2020-04-28 21:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0212_auto_20200423_1708'),
    ]

    operations = [
        migrations.RenameField(
            model_name='disponibilidadservicio',
            old_name='Cons',
            new_name='Cons1',
        ),
        migrations.AddField(
            model_name='disponibilidadservicio',
            name='Cons2',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='disponibilidadservicio',
            name='ConsGineco',
            field=models.IntegerField(default=0),
        ),
    ]
