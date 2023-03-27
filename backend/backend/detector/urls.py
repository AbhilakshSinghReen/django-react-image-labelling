from django.urls import path
from .views import ImageDetectionView, ImageDetectionListView, ImageDetectionUpdate, ImageDetectionDetail

urlpatterns = [
    path('detect-new/', ImageDetectionView.as_view(), name='detect_new'),
    path('get-saved-detections', ImageDetectionListView.as_view(), name='get_saved_detections'),
    path('update-saved/', ImageDetectionUpdate.as_view(), name='update_saved'),
    path('get-detail/', ImageDetectionDetail.as_view(), name='get_detail'),
]
