# Generated by Django 2.1.7 on 2020-04-14 22:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0207_auto_20200414_1557'),
    ]

    operations = [
        migrations.AddField(
            model_name='consulta',
            name='especialidad',
            field=models.CharField(blank=True, choices=[('Medicina Interna', 'Medicina Interna'), ('Cirugía', 'Cirugía'), ('Endocrinología', 'Endocrinología'), ('Ginecología', 'Ginecología'), ('Nefrología', 'Nefrología'), ('Neurocirugía', 'Neurocirugía'), ('Neurología', 'Neurología'), ('Pediatría', 'Pediatría'), ('Traumatología y Ortopedia', 'Traumatología y Ortopedia'), ('Urología', 'Urología')], max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='notaCinco',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='notaCuatro',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='notaDos',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='notaEvolucion',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='notaOcho',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='notaSeis',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='notaSiete',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='notaTres',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='notaUno',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='tituloCinco',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='tituloCuatro',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='tituloDos',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='tituloOcho',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='tituloSeis',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='tituloSiete',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='tituloTres',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='consulta',
            name='tituloUno',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='consulta',
            name='analisis',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
        migrations.AlterField(
            model_name='consulta',
            name='clinicos',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
        migrations.AlterField(
            model_name='consulta',
            name='impresionDiagnostica',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
        migrations.AlterField(
            model_name='consulta',
            name='manejoRecomendaciones',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
        migrations.AlterField(
            model_name='consulta',
            name='objetivo',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
        migrations.AlterField(
            model_name='consulta',
            name='plan',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
        migrations.AlterField(
            model_name='consulta',
            name='subjetivo',
            field=models.CharField(blank=True, max_length=4000, null=True),
        ),
    ]
