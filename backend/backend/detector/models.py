from django.db import models

class Detection(models.Model):
    image_filename = models.CharField(max_length=255)
    original_detections = models.TextField()
    detections = models.TextField()
    