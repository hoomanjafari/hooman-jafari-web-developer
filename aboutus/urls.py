from django.urls import path
from . import views

app_name = 'about-us'
urlpatterns = [
    path('', views.AboutUsView.as_view(), name='about_us')
]
