from django.shortcuts import (render, get_object_or_404)
from django.views import View
from .models import MyCv


class CvView(View):
    def get(self, request):
        cv = MyCv.objects.all().order_by('-added_time')
        return render(request, 'cv/cv.html', {'cv': cv})


class CvDetailsView(View):
    def get(self, request, **kwargs):
        cv_selected = MyCv.objects.filter(pk=kwargs['pk'])
        return render(request, 'cv/cv_details.html', {
            'cv_selected': cv_selected
        })
