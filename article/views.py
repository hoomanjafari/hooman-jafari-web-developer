from django.shortcuts import render
from django.views import View
from .models import Article


class ArticleView(View):
    def get(self, request):
        article = Article.objects.all()
        return render(request, 'article/article.html', {'article': article})
