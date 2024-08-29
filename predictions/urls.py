from django.urls import path
from .views import upload_view, predict

urlpatterns = [
    path('', upload_view, name='upload'),
    path('predict/', predict, name='predict'),
]