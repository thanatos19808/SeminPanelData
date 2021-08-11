from django.contrib import admin
from django.conf.urls import include, url
from .views import RegisterView, CustomLoginView
from allauth.account.views import ConfirmEmailView
from django.conf import settings
from django.conf.urls.static import static
from . import views
from django.urls import path

urlpatterns = [
    # Override urls
    url(r'^', include('django.contrib.auth.urls')),
    url(r'^rest-auth/login/', CustomLoginView.as_view()),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^account/', include('allauth.urls')),
    url(r'^rest-auth/registration/', RegisterView.as_view()),
    url(r'^registration/account-email-verification-sent/', views.null_view, name='account_email_verification_sent'),
    url(r'^registration/account-confirm-email/(?P<key>[-:\w]+)/$', ConfirmEmailView.as_view(), name='account_confirm_email'),
    url(r'^registration/complete/$', views.complete_view, name='account_confirm_complete'),
    # Default urls
    url(r'', include('rest_auth.urls')),
    url(r'^registration/', include('rest_auth.registration.urls')),
    url(r'^panelsemin/', admin.site.urls),
    # url(r'^panelradiologo/', include('')),
    url(r'^', include('semin.urls')),
    path(
        'api/v1/radiologos/',
        include('panel_radiologos.urls.radiologos_urls')
        ),
    path(
        'api/v1/paneldata/',
        include('panel_data.api.urls.url')
    )
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

