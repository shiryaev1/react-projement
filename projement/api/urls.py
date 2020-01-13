from django.urls import path, re_path, include

from .views import DashboardViewSet, ProjectUpdateView, CompanyCreateView, \
    ProjectCreateView, HistoryOfChangesListView, HistoryOfChangesDetailListView, \
    TagCreateView, TagUpdateView, TagDeleteView, TagAddingHistoryView, \
    InitialDataOfProjectView, RegisterAPI, LoginAPI, UserAPI, TagListView, \
    ProjectHistoryView

from knox import views as knox_views

app_name = 'api'

urlpatterns = [
    path('dashboard/', DashboardViewSet.as_view({'get': 'list'}),
         name='dashboard'),
    path('company/create/', CompanyCreateView.as_view(), name='company-create'),
    path('project/create/', ProjectCreateView.as_view(), name='project-create'),
    re_path(r'^project/(?P<id>[0-9]+)/update/$', ProjectUpdateView.as_view(),
            name='project-update'),
    re_path('^project/(?P<id>[0-9]+)/initial-data/$',
            InitialDataOfProjectView.as_view({'get': 'list'}), name='project-initial-data'),
    path('project/history/', HistoryOfChangesListView.as_view(),
         name='project-history'),
    re_path('^project/(?P<id>[0-9]+)/history/$',
            HistoryOfChangesDetailListView.as_view(),
            name='project-history-detail'),
    path('tags/', TagListView.as_view(), name='tag-list'),
    path('tag/create/',  TagCreateView.as_view(), name='tag-create'),
    re_path('^tag/(?P<id>[0-9]+)/update/$', TagUpdateView.as_view(),
            name='tag-update'),
    re_path('^tag/(?P<id>[0-9]+)/delete/$', TagDeleteView.as_view(),
            name='tag-delete'),
    path('tags/history/', TagAddingHistoryView.as_view(), name='tags-history'),
    path('auth/', include('knox.urls')),
    path('auth/register', RegisterAPI.as_view()),
    path('auth/login', LoginAPI.as_view()),
    path('auth/user', UserAPI.as_view()),
    path('auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('hist/', ProjectHistoryView.as_view())

]