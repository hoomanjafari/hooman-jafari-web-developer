from django.urls import path
from . import views

app_name = 'cv'
urlpatterns = [
    path('', views.CvView.as_view(), name='cv_page'),
    path('cv_details/<int:pk>/', views.CvDetailsView.as_view(), name='cv_details'),
]
