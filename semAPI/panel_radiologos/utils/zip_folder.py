import os
import zipfile

from django.conf import settings


class ZipFolder:
    def __init__(
            self,
            patient_name: str,
    ):
        self.patient_name = patient_name

    def zip_dir(
            self,
            folder_path: str,
            zipf: zipfile.ZipFile,
    ) -> None:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                zipf.write(os.path.join(root, file))

    def zip_content(
            self
    ) -> bool:
        try:
            zipf = zipfile.ZipFile(
                file=f'./{settings.FOLDER_FOR_STUDIES}/{self.patient_name}.zip',
                mode='w',
                compression=zipfile.ZIP_DEFLATED,
            )
            self.zip_dir(
                folder_path=f'./{settings.FOLDER_FOR_STUDIES}/{self.patient_name}/',
                zipf=zipf
            )
            zipf.close()
        except:
            return False

        return True



