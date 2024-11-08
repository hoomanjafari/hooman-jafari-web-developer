from django.db import models


class Contact(models.Model):
    subject = models.CharField(max_length=333,)
    email = models.EmailField(null=True, blank=True)
    number = models.PositiveIntegerField(blank=True, null=True)
    body = models.TextField()

    def __str__(self):
        return f'{self.email} - {self.subject}'
