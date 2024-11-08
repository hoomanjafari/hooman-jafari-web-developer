from django.db import models


class MyCv(models.Model):
    main_img = models.ImageField(upload_to='img/%y%m%d%H%M')
    title = models.CharField(max_length=300)
    body = models.CharField(max_length=300)
    details = models.TextField()
    customer = models.CharField(max_length=99)
    added_time = models.DateTimeField(auto_now_add=True)

    img_one = models.ImageField(upload_to='img/%y%m%d%H%M', null=True, blank=True)
    img_two = models.ImageField(upload_to='img/%y%m%d%H%M', null=True, blank=True)
    img_three = models.ImageField(upload_to='img/%y%m%d%H%M', null=True, blank=True)
    img_four = models.ImageField(upload_to='img/%y%m%d%H%M', null=True, blank=True)
    img_five = models.ImageField(upload_to='img/%y%m%d%H%M', null=True, blank=True)
    img_six = models.ImageField(upload_to='img/%y%m%d%H%M', null=True, blank=True)

    def __str__(self):
        return f'{self.body[:20]}'


class Hooman(models.Model):
    resume = models.FileField(upload_to='pdf/%y%m%d%H%M')
