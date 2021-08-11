import json
import os

import xmltodict
import requests
BASE_DICOM_GET_FOLDER_CONTENT_URL = 'https://dicom-semin.com/nextcloud/remote.php/dav/files/admin/'
BASE_DICOM_GET_FILE_URL = 'https://dicom-semin.com'
DICOM_USER = 'admin'
DICOM_PASSWORD = 'jamaliaca1980'

def get_list_of_elements_in_folder(folder_url):
    # Obtener la lista de estudios dentro de la carpeta
    response_list_of_files = requests.request(
        method='PROPFIND',
        url=BASE_DICOM_GET_FOLDER_CONTENT_URL + folder_url,
        auth=(
            DICOM_USER,
            DICOM_PASSWORD
        ),
        data='''<d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
                      <d:prop>
                            <d:getcontenttype />
                            <oc:size />
                            <d:resourcetype />
                            <d:getetag />
                      </d:prop>
                    </d:propfind>
                '''
        )
    # Pasar XML a JSON
    xml_response_list_of_files_parsing = json.loads(
        json.dumps(
            xmltodict.parse(
                response_list_of_files.content
                )
            )
        )

    # En todos los request vistos, siempre el primer elemento es de la misma carpeta
    xml_response_list_of_files_parsing['d:multistatus']['d:response'].pop(0)

    return xml_response_list_of_files_parsing

folder_url = '/Pruebas'
w = get_list_of_elements_in_folder(folder_url)
print(w)