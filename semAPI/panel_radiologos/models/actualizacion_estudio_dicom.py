from django.db import models

from panel_radiologos.models.estudio_dicom import EstudioDicom
from panel_radiologos.models.imagenologia import Imagenologia
from ..enums.accion_enum import AccionEnum


class ActualizacionEstudioDicom(models.Model):
    CREACION= 'CREACION'
    CARGA_DE_INTERPRETACION= 'CARGA DE INTERPRETACION'
    BORRADO_DE_INTERPRETACION= 'BORRADO DE INTERPRETACION'
    OTRO= 'OTRO'
    
    ACCION_CHOICES = (
        ('CREACION', 'CREACION'),
        ('CARGA_DE_INTERPRETACION', 'CARGA DE INTERPRETACION'),
        ('BORRADO_DE_INTERPRETACION', 'BORRADO DE INTERPRETACION'),
        ('OTRO', 'OTRO'),
    )
    
    
    doctor: Imagenologia = models.ForeignKey(
        Imagenologia,
        on_delete=models.PROTECT,
        related_name='estudios_actualizaciones'
    )

    estudio_dicom: EstudioDicom = models.ForeignKey(
        EstudioDicom,
        on_delete=models.CASCADE,
        related_name='actualizaciones'
    )
    
    accion: str = models.CharField(
        max_length=64,
        choices=ACCION_CHOICES,
        default=OTRO
    )

    creacion = models.DateTimeField(
        auto_now_add=True
    )
