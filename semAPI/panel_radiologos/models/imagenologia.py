from django.db import models

class Imagenologia(models.Model):
    nombre = models.CharField(max_length=90,null=True, blank=False)
    apellido_paterno = models.CharField(max_length=45,null=True, blank=False)
    apellido_materno = models.CharField(max_length=45,null=True, blank=True)
    telefono = models.IntegerField(null=True, blank=False)
    email = models.EmailField(max_length=45, unique=True ,null=True, blank=False)
    creacion = models.DateTimeField(auto_now_add=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)
    water_mark = models.ImageField(
        upload_to='media/water_marks', 
        null=True, 
        blank=True
        )

    def __str__(self):
        return '%s %s %s' % (self.nombre, self.apellido_paterno, self.apellido_materno)

    class Meta:
        verbose_name_plural = "Semin - Imagenologia"