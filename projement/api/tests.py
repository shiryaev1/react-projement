import json
import pdb

from django.contrib.auth.models import User
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APIRequestFactory, force_authenticate, APIClient

from . import views
from .models import Project, Tag, Company


def create_company():
    company = Company.objects.create(
        name='Test'
    )
    return company


class DashboardTestCase(TestCase):

    fixtures = ['initial.json']

    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(username='admin',
                                             password='123123qweqwe')
        self.token = Token.objects.create(user=self.user)
        self.api_authentication()

    def api_authentication(self):
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION="Token" + self.token.key)

    def test_get_dashboard(self):
        client = Client()
        response = client.get('/api/dashboard/')
        self.assertEqual(response.status_code, 401)

        # Authenticated users can see the dashboard
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/dashboard/')

        self.assertEqual(response.status_code, 200)

    def test_projects_on_dashboard(self):

        # There are 3 projects on the dashboard (loaded from the fixtures)
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/dashboard/')
        projects = response.data

        self.assertEqual(len(projects), 3)


class ProjectsTestCase(TestCase):
    fixtures = ['initial.json']

    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(username='admin',
                                             password='123123qweqwe')
        self.token = Token.objects.create(user=self.user)
        self.api_authentication()
        self.projects = Project.objects.order_by('id')

    def api_authentication(self):
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION="Token" + self.token.key)

    def create_tag(self):
        tag = Tag.objects.create(
            title='python'
        )
        return tag

    def test_create_project(self):
        company = create_company()
        tag = self.create_tag()
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/project/create/', {
            'title': 'test-company',
            'start_date': '2012-01-12',
            'end_date': '',
            'estimated_design': 1,
            'actual_design': 3,
            'estimated_development': 4,
            'actual_development': 3,
            'estimated_testing': 3,
            'actual_testing': 4,
            'company': company.id,
            'tags': tag.id,
        })

        self.assertEqual(response.status_code, 201)

    def test_project_has_ended(self):

        # 2 of the projects have ended
        self.assertListEqual([p.has_ended for p in self.projects], [True, True, False])

    def test_project_is_over_budget(self):

        # 1 of the projects is over budget
        self.assertListEqual([p.is_over_budget for p in self.projects], [True, False, False])

    def test_total_estimated_hours(self):

        self.assertListEqual([p.total_estimated_hours for p in self.projects], [690, 170, 40])

    def test_total_actual_hours(self):

        self.assertListEqual([p.total_actual_hours for p in self.projects], [739, 60, 5])

    def test_range_actual_hours(self):
        project = Project.objects.get(id=self.projects[0].id)
        Project.objects.update(
            actual_testing=4
        )
        project.refresh_from_db()
        self.assertEqual(project.actual_testing, 4)


class TagTestCase(TestCase):

    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(username='admin',
                                             password='123123qweqwe')
        self.token = Token.objects.create(user=self.user)
        self.api_authentication()
        self.projects = Project.objects.order_by('id')

    def api_authentication(self):
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION="Token" + self.token.key)

    def create_tag(self):
        tag = Tag.objects.create(
            title='python'
        )
        return tag

    def create_project(self):
        company = create_company()
        tag = self.create_tag()
        project = self.client.post('/api/project/create/', {
            'title': 'test-company',
            'start_date': '2012-01-12',
            'end_date': '',
            'estimated_design': 1,
            'actual_design': 3,
            'estimated_development': 4,
            'actual_development': 3,
            'estimated_testing': 3,
            'actual_testing': 4,
            'company': company,
            'tags': tag,
        })
        return project

    def test_get_history_of_changes(self):

        response = self.client.get('/api/tags/history/')
        self.assertEqual(response.status_code, 401)

        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/tags/history/')

        self.assertEqual(response.status_code, 200)
#
    def test_tags_list_requires_authentication(self):

        # All users can see the tags-list.
        response = self.client.get('/api/tags/')
        self.assertEqual(response.status_code, 200)

    def test_tag_create(self):

        # Anonymous users can't create tag

        response = self.client.get('/api/tag/create/')
        self.assertEqual(response.status_code, 401)

        # Authenticated users can create tag

        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/tag/create/', {
            'title': self.create_tag()
        })

        self.assertEqual(response.status_code, 201)

    def test_update_tag(self):

        # Anonymous users can't update tag

        tag = self.create_tag()

        response = self.client.put(f'/api/tag/{tag.id}/update/', json.dumps(
                              {
                                  'title': 'django',
                              }), content_type='application/json'

        )

        self.assertEqual(response.status_code, 401)

        tag.refresh_from_db()
        self.assertEqual(tag.title, 'python')

        # Authenticated users can update tag

        self.client.force_authenticate(user=self.user)

        response = self.client.put(f'/api/tag/{tag.id}/update/', json.dumps(
                                   {
                                       'title': 'django',
                                   }), content_type='application/json'

                                   )

        self.assertEqual(response.status_code, 200)

        tag.refresh_from_db()
        self.assertEqual(tag.title, 'django')

    def test_tag_delete(self):

        # Anonymous users can't delete tag

        tag = self.create_tag()
        response = self.client.delete(
            reverse('api:tag-delete', kwargs={'id': tag.id}))

        self.assertEqual(response.status_code, 401)

        tag.refresh_from_db()
        self.assertEqual(tag.title, 'python')

        # Authenticated users can update tag

        self.client.force_authenticate(user=self.user)
        response = self.client.delete(
            reverse('api:tag-delete', kwargs={'id': tag.id}))

        self.assertEqual(response.status_code, 204)


