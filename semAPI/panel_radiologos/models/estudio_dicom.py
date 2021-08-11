from django.db import models

from semin.models import Paciente, ESTUDIO_CHOICES


class EstudioDicom(models.Model):
    
    
    paciente = models.ForeignKey(
        Paciente,
        null=True,
        blank=False,
        on_delete=models.CASCADE
    )

    directorio_paciente = models.CharField(
        max_length=800,
        null=False,
        blank=False,
    )

    tipo_estudio = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        choices=ESTUDIO_CHOICES,
    )
    
    interpretado = models.BooleanField(
        default=False
    )
    
    liberado = models.BooleanField(
        default=False
    )

    creacion = models.DateTimeField(
        auto_now_add=True
    )
