from django.db import models


class Article(models.Model):
    image = models.ImageField(upload_to='img/%y')
    tag = models.CharField(max_length=9)
    subject = models.CharField(max_length=40)
    body = models.TextField(max_length=160)

    def __str__(self):
        return f'{self.tag} - {self.subject}'
