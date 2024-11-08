from django.views import View
from cv.models import Hooman
from django.shortcuts import render


class Home(View):
    def get(self, request):
        hooman = Hooman.objects.all()
        return render(request, 'index/index.html', {'hooman': hooman})


class SearchView(View):
    def get(self, request):
        return render(request, 'index/search_page.html')
