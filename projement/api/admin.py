from django.contrib import admin

from api.models import Project, HistoryOfChanges, Tag

admin.site.register(Project)
admin.site.register(HistoryOfChanges)
admin.site.register(Tag)
