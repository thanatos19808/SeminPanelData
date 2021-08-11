import glob
import cv2
from django.conf import settings


class VideoConverter:
    def __init__(
            self,
            patient_name: str,
    ):
        self.patient_name = patient_name

    def convert_to_video(self) -> bool:
        frame_size = (960, 720)
        folder_for_studies = settings.FOLDER_FOR_STUDIES
        out = cv2.VideoWriter(f'./{folder_for_studies}/{self.patient_name}/{self.patient_name}.avi', cv2.VideoWriter_fourcc(*'DIVX'), 1, frame_size)
        try:
            for filename in glob.glob(f'./{folder_for_studies}/{self.patient_name}/*.jpeg'):
                img = cv2.imread(filename)
                img = cv2.resize(img, frame_size, interpolation=cv2.INTER_AREA)
                out.write(img)
            out.release()
        except Exception as e:
            print(e)
            return False

        return True
