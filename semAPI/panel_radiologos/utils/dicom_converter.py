import os

import cv2
from numpy.core.fromnumeric import shape
from requests import Response
from rest_framework import status
from rest_framework.response import Response

from ..enums.image_extension_enum import ImageExtensionEnum
import pydicom as dicom
from typing import List, Union
from django.conf import settings
import numpy as np
import png

class DicomConverter:

    def __init__(
            self,
            image_list: List,
            patient_name: str,
            convert_to: ImageExtensionEnum,
    ):
        self.image_list = image_list
        self.patient_name = patient_name
        self.convert_to = convert_to

    def convert_image(
        self
        ) -> Union[List, bool]:
        patient_folder = f'./{settings.FOLDER_FOR_STUDIES}/{self.patient_name}'
        image_converted = []
        for image_name in self.image_list:
            try:
                # Png
                ds = dicom.dcmread(os.path.join(patient_folder, image_name))
                shape = ds.pixel_array.shape
                image_2d = ds.pixel_array.astype(float)
                image_2d_scaled = (np.maximum(image_2d, 0) / image_2d.max()) * 255.0
                image_2d_scaled = np.uint8(image_2d_scaled)
                image_name = image_name.replace('.dcm', '.png')
                with(open(os.path.join(patient_folder, image_name), 'wb')) as png_file:
                    w = png.Writer(shape[1], shape[0], greyscale=True)
                    w.write(png_file, image_2d_scaled)
            except:
                return False
        return image_converted