import os
import time
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.python.keras.utils.data_utils import get_file

# from dirs import pretrained_models_dir
pretrained_models_dir = os.path.join(os.path.dirname(__file__), "pretrained_models")

class Detector:
    def __init__(self, class_names_file_path, model_url):
        self.models_cache_dir = pretrained_models_dir
        self.models_cache_subdir = "checkpoints"
        os.makedirs(self.models_cache_dir, exist_ok=True)

        self.read_class_names(class_names_file_path)
        self.download_model(model_url)
        self.load_model()

    def read_class_names(self, class_names_file_path):
        with open(class_names_file_path, 'r') as class_names_file: # Read the class names from the file
            self.class_names = class_names_file.read().splitlines()
        
        # Assign a random color to each class
        self.class_colors = np.random.uniform(low = 0, high = 255, size = (len(self.class_names), 3))

    def download_model(self, model_url):
        model_file_name = os.path.basename(model_url)
        self.model_name = model_file_name[:model_file_name.index('.')]

        # Download the model if required using Keras' get_file function
        get_file(fname=model_file_name, origin=model_url, cache_dir=self.models_cache_dir, cache_subdir=self.models_cache_subdir, extract=True)

    def load_model(self):
        """Loads the model that has been downloaded."""
        print(f"Loading model: {self.model_name}")
        tf.keras.backend.clear_session()
        self.model = tf.saved_model.load(os.path.join(self.models_cache_dir, self.models_cache_subdir, self.model_name, "saved_model"))
        print(f"Model: {self.model_name} loaded successfully.")

    def get_detections(self, image, max_output_size, iou_threshold, score_threshold):
        """Gets bounding boxes for a single class."""
        input_tensor = tf.convert_to_tensor(image, dtype=tf.uint8) # Convert image to Tensor
        input_tensor = input_tensor[tf.newaxis, ...] # Add new dimension to Tensor since model predicts on an array of images

        detections = self.model(input_tensor) # Get the detections

        # Extract bboxes, class indices, and class scores
        bboxes = detections['detection_boxes'][0].numpy()
        class_indices = detections['detection_classes'][0].numpy().astype(np.int32)
        class_scores = detections['detection_scores'][0].numpy()

        bbox_indices = tf.image.non_max_suppression( # Filter the bboxes
            bboxes, 
            class_scores, 
            max_output_size=max_output_size, 
            iou_threshold=iou_threshold, 
            score_threshold=score_threshold
        )

        detections = []

        for i in bbox_indices:
                bbox = tuple(bboxes[i].tolist())
                class_confidence = round(100 * class_scores[i])
                class_index = class_indices[i]

                if class_index >= len(self.class_names):
                    continue

                class_label_text = self.class_names[class_index]

                y_min = int(bbox[0] * 480)
                x_min = int(bbox[1] * 640)
                y_max = int(bbox[2] * 480)
                x_max = int(bbox[3] * 640)

                detections.append({
                    'class_name': class_label_text,
                    'class_confidence': class_confidence,
                    'y_min': y_min,
                    'x_min': x_min,
                    'y_max': y_max,
                    'x_max': x_max,
                })

        for detection in detections:
            image = cv2.rectangle(image, (detection['x_min'], detection['y_min']), (detection['x_max'], detection['y_max']), (255, 0, 0), 3)

        cv2.imwrite("Last-Save.jpg", image)

        return detections
    