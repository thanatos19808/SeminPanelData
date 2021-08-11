# Generated by Django 2.1.7 on 2020-04-03 16:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('semin', '0167_auto_20200402_1449'),
    ]

    operations = [
        migrations.CreateModel(
            name='cie10',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('LETRA', models.CharField(blank=True, max_length=400, null=True)),
                ('CATALOG_KEY', models.CharField(blank=True, max_length=400, null=True)),
                ('ASTERISCO', models.CharField(blank=True, max_length=400, null=True)),
                ('NOMBRE', models.CharField(blank=True, max_length=400, null=True)),
                ('LSEX', models.CharField(blank=True, max_length=400, null=True)),
                ('LINF', models.CharField(blank=True, max_length=400, null=True)),
                ('LSUP', models.CharField(blank=True, max_length=400, null=True)),
                ('TRIVIAL', models.CharField(blank=True, max_length=400, null=True)),
                ('ERRADICADO', models.CharField(blank=True, max_length=400, null=True)),
                ('N_INTER', models.CharField(blank=True, max_length=400, null=True)),
                ('NIN', models.CharField(blank=True, max_length=400, null=True)),
                ('NINMTOBS', models.CharField(blank=True, max_length=400, null=True)),
                ('NO_CBD', models.CharField(blank=True, max_length=400, null=True)),
                ('NO_APH', models.CharField(blank=True, max_length=400, null=True)),
                ('FETAL', models.CharField(blank=True, max_length=400, null=True)),
                ('CLAVE_CAPITULO_TYPE', models.CharField(blank=True, max_length=400, null=True)),
                ('CAPITULO_TYPE', models.CharField(blank=True, max_length=400, null=True)),
                ('RUBRICA_TYPE', models.CharField(blank=True, max_length=400, null=True)),
                ('YEAR_MODIFI', models.CharField(blank=True, max_length=400, null=True)),
                ('YEAR_APLICACION', models.CharField(blank=True, max_length=400, null=True)),
                ('NOTDIARIA', models.CharField(blank=True, max_length=400, null=True)),
                ('NOTSEMANAL', models.CharField(blank=True, max_length=400, null=True)),
                ('SISTEMA_ESPECIAL', models.CharField(blank=True, max_length=400, null=True)),
                ('BIRMM', models.CharField(blank=True, max_length=400, null=True)),
                ('CVE_CAUSA_TYPE', models.CharField(blank=True, max_length=400, null=True)),
                ('CAUSA_TYPE', models.CharField(blank=True, max_length=400, null=True)),
                ('EPI_MORTA', models.CharField(blank=True, max_length=400, null=True)),
                ('EPI_MORTA_M5', models.CharField(blank=True, max_length=400, null=True)),
                ('EDAS_E_IRAS_EN_M5', models.CharField(blank=True, max_length=400, null=True)),
                ('LISTA1', models.CharField(blank=True, max_length=400, null=True)),
                ('LISTA5', models.CharField(blank=True, max_length=400, null=True)),
                ('PRINMORTA', models.CharField(blank=True, max_length=400, null=True)),
                ('PRINMORBI', models.CharField(blank=True, max_length=400, null=True)),
                ('LM_MORBI', models.CharField(blank=True, max_length=400, null=True)),
                ('LM_MORTA', models.CharField(blank=True, max_length=400, null=True)),
                ('LGBD165', models.CharField(blank=True, max_length=400, null=True)),
                ('LOMSBECK', models.CharField(blank=True, max_length=400, null=True)),
                ('LGBD190', models.CharField(blank=True, max_length=400, null=True)),
                ('ES_CAUSES', models.CharField(blank=True, max_length=400, null=True)),
                ('NUM_CAUSES', models.CharField(blank=True, max_length=400, null=True)),
                ('ES_SUIVE_MORTA', models.CharField(blank=True, max_length=400, null=True)),
                ('DAGA', models.CharField(blank=True, max_length=400, null=True)),
                ('EPI_CLAVE', models.CharField(blank=True, max_length=400, null=True)),
                ('EPI_CLAVE_DESC', models.CharField(blank=True, max_length=400, null=True)),
                ('ES_SUIVE_MORB', models.CharField(blank=True, max_length=400, null=True)),
                ('ES_SUIVE_NOTIN', models.CharField(blank=True, max_length=400, null=True)),
                ('ES_SUIVE_EST_EPI', models.CharField(blank=True, max_length=400, null=True)),
                ('ES_SUIVE_EST_BROTE', models.CharField(blank=True, max_length=400, null=True)),
                ('SINAC', models.CharField(blank=True, max_length=400, null=True)),
                ('CODIGOX', models.CharField(blank=True, max_length=400, null=True)),
                ('COD_SIT_LESION', models.CharField(blank=True, max_length=400, null=True)),
            ],
            options={
                'verbose_name_plural': 'CIE-10',
            },
        ),
    ]