from django.utils.translation import ugettext_lazy as _
from rest_auth.app_settings import (TokenSerializer,JWTSerializer,create_token)
from django.conf import settings
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view
from django.views.decorators.debug import sensitive_post_parameters
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework import status
from allauth.account.utils import complete_signup
from allauth.account import app_settings as allauth_settings
from rest_auth.models import TokenModel
from rest_auth.views import LoginView
from rest_auth.registration.app_settings import RegisterSerializer, register_permission_classes
from django.contrib.auth.models import User
from semin.models import Profile

sensitive_post_parameters_m = method_decorator(
    sensitive_post_parameters('password1', 'password2')
)


@api_view()
def null_view(request):
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view()
def complete_view(request):
    return Response("Email account is activated")


class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = register_permission_classes()
    token_model = TokenModel

    @sensitive_post_parameters_m
    def dispatch(self, *args, **kwargs):
        return super(RegisterView, self).dispatch(*args, **kwargs)

    def get_response_data(self, user):
        if allauth_settings.EMAIL_VERIFICATION == \
                allauth_settings.EmailVerificationMethod.MANDATORY:
            return {"detail": _("Verification e-mail sent.")}
        if getattr(settings, 'REST_USE_JWT', False):
            data = {
                'user': user,
                'token': self.token
            }
            return JWTSerializer(data).data
        else:
            return TokenSerializer(user.auth_token).data

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        Profile.objects.create(user=user)
        headers = self.get_success_headers(serializer.data)

        return Response(self.get_response_data(user),
                        status=status.HTTP_201_CREATED,
                        headers=headers)

    def perform_create(self, serializer):
        user = serializer.save(self.request)
        if getattr(settings, 'REST_USE_JWT', False):
            self.token = jwt_encode(user)
        else:
            create_token(self.token_model, user, serializer)

        complete_signup(self.request._request, user,
                        allauth_settings.EMAIL_VERIFICATION,
                        None)
        return user


class CustomLoginView(LoginView):
    
    def get_response(self):
        orginal_response = super().get_response()

        custom_response = {"user": {
            "username": self.user.username,
            "email": self.user.email,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "id_sem": self.user.profile.id_sem,
            "tipo":self.user.profile.tipo,
        }}
        
        orginal_response.data.update(custom_response)
        return orginal_response
