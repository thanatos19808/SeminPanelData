import json
import os
from typing import Union, List

import xmltodict
import requests
from django.conf import settings
from rest_framework.response import Response

# TODO: Check what will happend with the folder with the images
class DicomDownloader:
    def __init__(
            self,
            folder_url: str,
            patient_name: str,
    ):
        self.folder_url = folder_url
        self.patient_name = patient_name

    def get_list_of_elements_in_folder(
            self,
    ) -> dict:
        # Obtener la lista de estudios dentro de la carpeta
        response_list_of_files = requests.request(
            method='PROPFIND',
            url=settings.BASE_DICOM_GET_FOLDER_CONTENT_URL + self.folder_url,
            auth=(
                settings.DICOM_USER,
                settings.DICOM_PASSWORD
            ),
            data='''<d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
                      <d:prop>
                            <d:getcontenttype />
                            <oc:size />
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

    def download_studies(
            self
    ) -> Union[Response, List[str]]:
        content_list = self.get_list_of_elements_in_folder()

        studies_path = []
        folder_for_studies = settings.FOLDER_FOR_STUDIES
        try:
            if not os.path.isdir(f'./{folder_for_studies}/{self.patient_name}/'):
                os.makedirs(f'./{folder_for_studies}/{self.patient_name}/', mode=0o777)
        except OSError:
            raise OSError

        for index, study in enumerate(content_list['d:multistatus']['d:response']):
            if study['d:propstat']['d:prop']['d:getcontenttype'] == "application/dicom":
                response_file = requests.request(
                    method='GET',
                    url=f'https://dicom-semin.com{study["d:href"]}',
                    auth=(
                        settings.DICOM_USER,
                        settings.DICOM_PASSWORD,
                    ),
                )
                if response_file.status_code == 200:
                    with open(f'./{folder_for_studies}/{self.patient_name}/{index}.dcm', 'wb') as file:
                        file.write(response_file.content)
                        studies_path.append(f'{index}.dcm')
                else:
                    raise Exception
        return studies_path
