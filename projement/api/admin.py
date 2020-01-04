from django.contrib import admin

from api.models import Project, HistoryOfChanges

admin.site.register(Project)
admin.site.register(HistoryOfChanges)