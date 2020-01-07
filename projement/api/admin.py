from django.contrib import admin

from api.models import Project, HistoryOfChanges, Tag, TagAddingHistory

admin.site.register(Project)
admin.site.register(HistoryOfChanges)
admin.site.register(Tag)
admin.site.register(TagAddingHistory)