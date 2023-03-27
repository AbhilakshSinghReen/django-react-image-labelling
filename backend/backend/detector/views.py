import os
import cv2
import time
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from .models import Detection
from backend import settings
from uuid import uuid4
from .serializers import DetectionSerializer
from rest_framework import status
from .detector import Detector
from datetime import datetime
import json


IMAGES_SAVE_FOLDER = os.path.join(settings.MEDIA_ROOT, "detection_images")
pretrained_models_dir = os.path.join(os.path.dirname(__file__), "pretrained_models")
coco_names_file_path = os.path.join(pretrained_models_dir, "coco.names")
model_url = "http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_320x320_coco17_tpu-8.tar.gz" # SSD MobileNet
max_output_size = 50
iou_threshold = 0.5
score_threshold = 0.4

detector_model = Detector(coco_names_file_path, model_url) # Create Detector instance


def save_image(image_file, extension):
    image_filename = f"{uuid4()}_{round(time.time() * 1000)}{extension}"
    image_path = os.path.join(IMAGES_SAVE_FOLDER, image_filename)
    with open(image_path, 'wb+') as destination:
        for chunk in image_file.chunks():
            destination.write(chunk)

    return image_filename

def get_detections(image_filename):
    image = cv2.imread(os.path.join(IMAGES_SAVE_FOLDER, image_filename))
    detections = detector_model.get_detections(image, max_output_size, iou_threshold, score_threshold)
    return detections

class ImageDetectionView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        image_file = request.FILES.get('image')
        if image_file == None:
            pass

        image_filename = save_image(image_file, ".jpg")
        detections = get_detections(image_filename)
        new_detection = Detection.objects.create(image_filename=image_filename, original_detections=json.dumps(detections), detections=json.dumps(detections))
        return Response({
            "id":new_detection.id
            })

class ImageDetectionListView(APIView):
    def get(self, request):
        detection_objects = Detection.objects.all().values('id', 'image_filename')
        # serializer = DetectionSerializer(detection_objects, many=True, fields = ('id', 'image_filename'))
        return Response(detection_objects)

class ImageDetectionDetail(APIView):
    def get(self, request):
        id = request.query_params.get('id', None)
        if id is None:
            return Response({'error': 'id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            detection_object = Detection.objects.get(id=id)
            serializer = DetectionSerializer(detection_object)
            return Response(serializer.data)
        except Detection.DoesNotExist:
            return Response({'error': 'detection object with given id does not exist'}, status=status.HTTP_400_BAD_REQUEST)

class ImageDetectionUpdate(APIView):
        def patch(self, request, format=None):
            # extract the new detections from the JSON request body
            try:
                id = request.data['id']
                detections = request.data['detections']
            except KeyError:
                return Response({'error': 'Invalid request body'}, status=status.HTTP_400_BAD_REQUEST)
            
            detection = Detection.objects.get(id=id)
            
            # update the detection object and save it
            detection.detections = detections
            detection.save()
            
            # serialize and return the updated object
            serializer = DetectionSerializer(detection)
            return Response(serializer.data)