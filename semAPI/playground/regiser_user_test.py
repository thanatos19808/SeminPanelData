import requests

r = requests.post(
    'https://semindigital.com:8090/rest-auth/registration/', 
    data = {
        'password1':'vara2020',
        'password2': 'vara2020',
        'email': 'tw@test.com'
        }
)
if r.status_code in (201, 400) :
    # Send email
    print('YEs')
    
print(r.status_code )
print(r.text)