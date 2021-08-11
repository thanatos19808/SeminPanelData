import os
from django.urls import reverse_lazy
import datetime

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'ftov1!91yf@7f7&g2%*@0_e^)ac&f&9jeloc@#v76#^b1dhbl#'

STRIPE_SECRET_KEY_TEST = 'sk_test_51GqPAoGf06IOI4exgWTc2O7Tibbk7cMAb13qBNlTlVOFSeMAbemFoBQkh9x5lqmOQiBeAvurKERbcxT4VVdmKBtH00WYc0ypks'
STRIPE_SECRET_KEY_PRODUCTION = 'sk_live_FYdGIcmllAc9rQxnq2ib99Sn00TYJJX6m2'

# Zoom secret keys
API_KEY = 'T2gRZWUETOO-hfl7vpUG4g'
API_SECRET = '6UpB37oN5S1uiApQlZbkTK3PHPYjQMm8ONal'

# DICOM secret access
BASE_DICOM_GET_FOLDER_CONTENT_URL = 'https://dicom-semin.com/nextcloud/remote.php/dav/files/admin/'
BASE_DICOM_GET_FILE_URL = 'https://dicom-semin.com'
DICOM_USER = 'admin'
DICOM_PASSWORD = 'jamaliaca1980'
FOLDER_FOR_STUDIES = 'media/dicom/'
WATER_MARKS = 'media/water_marks/'

#rehabilitacion
FOLDER_FOR_REHABILITACION = 'media/rehabilitacion'


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

#ALLOWED_HOSTS = ['138.68.9.21', 'semindigital.com']
ALLOWED_HOSTS=['*']


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_THROTTLE_CLASSES': (
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ),
    'DEFAULT_THROTTLE_RATES': {
        'anon': '1000/day',
        'user': '1000/day'
    }
}

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sites',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'rest_framework.authtoken',
    'rest_auth',
    'allauth',
    'allauth.account',
    'rest_auth.registration',
    'allauth.socialaccount',
    'multiselectfield',
    'django_cron',
    'django_crontab',
    'sortedm2m',
    'import_export',
    # Our apps
    'semin',
    'panel_radiologos',
    'panel_data',
]

# Sitio default
SITE_ID = 2
#Registro simple sin correo
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
#Login con correo
ACCOUNT_AUTHENTICATION_METHOD = 'username_email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = 'none'
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
#ACCOUNT_EMAIL_CONFIRMATION_ANONYMOUS_REDIRECT_URL = 'https://semindigital.com/confirmacion'
#ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL = 'https://semindigital.com/confirmacion'
ACCOUNT_USERNAME_REQUIRED = False
#Following is added to enable registration with email instead of username
AUTHENTICATION_BACKENDS = (
 # Needed to login by username in Django admin, regardless of `allauth`
 "django.contrib.auth.backends.ModelBackend",

 # `allauth` specific authentication methods, such as login by e-mail
 "allauth.account.auth_backends.AuthenticationBackend",
)

DEFAULT_FROM_EMAIL = 'mail@semin.mx'
# Email backend settings for Django
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
#EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_HOST = 'mail.semin.mx'
EMAIL_PORT = 2525
EMAIL_HOST_USER = 'mail@semin.mx'
EMAIL_HOST_PASSWORD = 'cdymwtrhom'
EMAIL_USE_TLS = True

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.BrokenLinkEmailsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ORIGIN_ALLOW_ALL = True
#CORS_ALLOW_CREDENTIALS = False

ROOT_URLCONF = 'api_crud.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'api_crud.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


MIDDLEWARE_CLASSES = {
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
}


# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

#LANGUAGE_CODE = 'es-MX'
#TIME_ZONE = 'Etc/GMT-6'
#USE_I18N = True
#USE_L10N = True

LANGUAGE_CODE = 'es-MX'

TIME_ZONE = 'Mexico/General'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATIC_URL = '/static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

CRONJOBS = [
('*/1 * * * *', 'semin.cron.my_scheduled_job', '>> /tmp/scheduled_job.log')
]


#SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
#SECURE_SSL_REDIRECT =   True
#SESSION_COOKIE_SECURE = True 
#CSRF_COOKIE_SECURE = True




JWT_AUTH = {
    # how long the original token is valid for
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=2),

    # allow refreshing of tokens
    'JWT_ALLOW_REFRESH': True,

    # this is the maximum time AFTER the token was issued that
    # it can be refreshed.  exprired tokens can't be refreshed.
    'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=7),
}

