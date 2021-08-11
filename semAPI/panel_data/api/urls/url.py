from django.urls import path, re_path
from django.conf.urls import url
from ..views import ventas_views, finanzas_views, activities_views, product_views
from semin.views import *

urlpatterns = [
    path('all_ventas',
        ventas_views.get_post_ventas_totales,
        name='get_post_ventas_totales'
    ),
    path('sucursals',
        ventas_views.get_sucursals,
        name='get_sucursals'
    ),
    path('ventas_estudios',
        ventas_views.get_filter_all_venta_estudios,
        name='get_post_venta_estudios'
    ),
    path('ventas_all_area',
        ventas_views.get_all_areas,
        name='get_ventas_by_area'
    ),
    path('ventas_area',
        ventas_views.get_ventas_by_area,
        name='get_ventas_by_area'
    ),
    path('ventas_departament',
        ventas_views.get_filter_all_venta_departament,
        name='get_post_venta_estudios'
    ),
    path('box_cut',
        finanzas_views.get_post_corte_caja,
        name='get_post_corte_caja'
    ),
    path('devoluciones',
        finanzas_views.get_devoluciones,
        name='get_post_devoluciones'
    ),
    path('devoluciones/type',
        finanzas_views.get_type_devoluciones,
        name='get_type_devoluciones'
    ),
    path('loginAud',
        activities_views.get_post_loginAud,
        name='get_post_loginAud'
    ),
    path('loginAdmin',
        activities_views.get_post_loginAdmin,
        name='get_post_loginAdmin'
    ),
    path('usersAdmin',
        activities_views.get_administrators,
        name='get_post_administrators'
    ),
    path('userAdmin/<id>',
        activities_views.get_put_one_admin,
        name='get_post_one_admin'
    ),
    path('permisos',
        activities_views.get_permisos_user,
        name='get_post_permisos_user'
    ),
    path('empleados',
        finanzas_views.get_post_empleados_user,
        name='get_post_empleados_user'
    ),
    path('product_user',
        product_views.get_user_num_studies,
        name='get_user_num_studies'
    ),


    
    # url privadas
    path('activities/registration_login',
        activities_views.get_post_activity_login,
        name='get_post_activity_login'
    ),
    path('activities/registration_views',
        activities_views.get_post_activity_views,
        name='get_post_activity_views'
    ),
    

]