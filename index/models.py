from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    name = models.CharField(max_length=66)
    online = models.BooleanField(default=False)


class LiveSupportConnection(models.Model):
    user_name = models.CharField(max_length=66)
    user_number = models.CharField(max_length=66)
    admin = models.CharField(max_length=66)
    received = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user_name} ({self.user_number}) Connect to {self.admin}'


class LiveSupportMessages(models.Model):
    message = models.TextField()
    msg_sender_username = models.CharField(max_length=66, blank=True, null=True)
    msg_sender_number = models.CharField(max_length=66, blank=True, null=True)
    msg_receiver = models.CharField(max_length=66, blank=True, null=True)
    msg_receiver_number = models.CharField(max_length=66, blank=True, null=True)
    received = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)
    created_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.msg_sender_username} Send to {self.msg_receiver}'
