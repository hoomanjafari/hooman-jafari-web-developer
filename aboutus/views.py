from django.shortcuts import render
from django.views import View


class AboutUsView(View):
    def get(self, request):
        return render(request, 'aboutus/about_us(front).html')
