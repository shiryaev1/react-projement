from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from api.models import Project, HistoryOfChanges, Tag, TagAddingHistory


# class ProjectAdmin(SimpleHistoryAdmin):
#     list_display = ["id", "title", "history_type", ]
#     history_list_display = ["history_type", ]
#     # search_fields = ['name', 'user__username']


admin.site.register(Project, SimpleHistoryAdmin)
admin.site.register(HistoryOfChanges)
admin.site.register(Tag)
admin.site.register(TagAddingHistory)
