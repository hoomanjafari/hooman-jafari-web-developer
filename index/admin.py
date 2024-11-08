from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (User, LiveSupportMessages, LiveSupportConnection)


UserAdmin.fieldsets += (('Extra Fields', {'fields': ('name', 'online')}),)

admin.site.register(User, UserAdmin)
admin.site.register(LiveSupportConnection)
admin.site.register(LiveSupportMessages)
