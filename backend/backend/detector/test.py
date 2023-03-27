import os
import time
import cv2
import numpy as np

from detector import Detector # Detecting enemies in frame

if __name__ == "__main__":
    pretrained_models_dir = os.path.join(os.path.dirname(__file__), "pretrained_models")
    coco_names_file_path = os.path.join(pretrained_models_dir, "coco.names")
    model_url = "http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_320x320_coco17_tpu-8.tar.gz" # SSD MobileNet
    max_output_size = 50
    iou_threshold = 0.5
    score_threshold = 0.2

    detector_model = Detector(coco_names_file_path, model_url) # Create Detector instance



    image = cv2.imread("1.jpg")
    bboxes = detector_model.get_detections(image, max_output_size, iou_threshold, score_threshold)

    print(bboxes)
