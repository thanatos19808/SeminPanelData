import requests
from rest_framework.fields import JSONField
import json

class RegisterUserRequest:

    def register_user_rest_auth(
        self,
        email: str,
        password: str,
    ) -> bool:
        r = requests.post(
            'https://semindigital.com:8090/rest-auth/registration/', 
            data = {
                'password1': password,
                'password2': password,
                'email': email,
                }
            )
        if r.status_code in (201, 400) :
            return True
        else:
            return False
    
    
        