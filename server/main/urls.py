# django_project/django_website/main/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("getdata", views.get_data, name="getdata"),
    path("postdata", views.post_data, name="postdata"),
]
