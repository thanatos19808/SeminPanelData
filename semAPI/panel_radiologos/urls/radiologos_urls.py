from django.conf.urls import url

from ..views import estudios, archivos, imagenologos

urlpatterns = [

    url(
        '^$',
        estudios.cargar_estudio,
        name='carga_de_estudios',
    ),
    
    url(
        'preview$',
        estudios.calcular_tiempo,
        name='calcular_tiempo'
    ),
    
    url(
        'estudios$',
        estudios.estudios,
        name='estudios'
    ),
    
    url(
        'descargar$',
        estudios.descargar,
        name='descargar'
    ),
    
    url(
        'actualizaciones$',
        estudios.actualizaciones,
        name='actualizaciones'
    ),
    
    url(
        'consultarImagenologo$',
        estudios.imagenologo,
        name='consultar_imagenologo'
    ),
    
    url(
        'interpretacion$',
        archivos.interpretacion,
        name='cargar_interpretacion'
    ),
    
    url(
        'interpretacion$',
        archivos.interpretacion,
        name='remover_interpretacion'
    ),
    
    url(
        'imagenologo$',
        imagenologos.update,
        name='update_imagenologo'
    ),

    url(
        'test$',
        imagenologos.test,
        name='test'
        )
    
]