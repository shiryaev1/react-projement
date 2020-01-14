from decimal import Decimal

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer

from .models import Project, Company, HistoryOfChanges, \
    InitialDataOfProject, Tag, TagAddingHistory


class DashboardListSerializer(ModelSerializer):
    url = serializers.URLField(source='get_api_absolute_url', )
    company = SerializerMethodField()
    estimated = serializers.DecimalField(max_digits=7, decimal_places=2,
                                         source='total_estimated_hours')
    actual = serializers.DecimalField(max_digits=7, decimal_places=2,
                                      source='total_actual_hours')

    class Meta:
        model = Project
        fields = [
            'id',
            'url',
            'title',
            'company',
            'estimated',
            'actual',
        ]

    def get_company(self, obj):
        return obj.company.name


class CompanyCreateSerializer(ModelSerializer):

    class Meta:
        model = Company
        fields = '__all__'


class History(serializers.ModelSerializer):
    def __init__(self, model, *args, fields='__all__', **kwargs):
        self.Meta.model = model
        self.Meta.fields = fields
        super().__init__()

    class Meta:
        pass


class ProjectHistory(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = ('history', )

    history = serializers.SerializerMethodField()

    def get_history(self, obj):
        model = obj.history.__dict__['model']
        fields = [
            'id',
            'title',
            'changed_by',
            'history_id',
            'history_date',
            'history_user',
            'history_type',
            'actual_design',
            'actual_development',
            'actual_testing',

        ]

        serializer = History(model, obj.history.all().order_by('history_date'),
                             fields=fields, many=True)
        serializer.is_valid()

        return serializer.data


class ProjectUpdateSerializer(ModelSerializer):
    changed_by = SerializerMethodField()

    additional_hour_design = serializers.DecimalField(max_digits=7,
                                                      decimal_places=2,
                                                      required=False,
                                                      default=0,
                                                      validators=[
                                                          MinValueValidator(0),
                                                          MaxValueValidator(9999)
                                                      ])
    additional_hour_development = serializers.DecimalField(max_digits=7,
                                                           decimal_places=2,
                                                           required=False,
                                                           default=0,
                                                           validators=[
                                                               MinValueValidator(0),
                                                               MaxValueValidator(9999)
                                                           ]
                                                           )
    additional_hour_testing = serializers.DecimalField(max_digits=7,
                                                       decimal_places=2,
                                                       required=False,
                                                       default=0,
                                                       validators=[
                                                           MinValueValidator(0),
                                                           MaxValueValidator(9999)
                                                       ]
                                                       )

    class Meta:
        model = Project
        fields = [
            'actual_design',
            'actual_development',
            'actual_testing',
            'additional_hour_design',
            'additional_hour_development',
            'additional_hour_testing',
            'changed_by',
        ]
        read_only_fields = ['actual_design',
                            'actual_development',
                            'actual_testing',
                            'changed_by'
                            ]
        extra_kwargs = {
            'additional_hour_design': {'write_only': True},
            'additional_hour_development': {'write_only': True},
            'additional_hour_testing': {'write_only': True}
        }

    def get_changed_by(self, obj):
        return obj.changed_by.username

    def update(self, instance, validated_data):
        default_value = Decimal(0)

        if Decimal(self.validated_data[
                       'additional_hour_design']) != default_value or \
                Decimal(self.validated_data[
                            'additional_hour_development']) != default_value or \
                Decimal(self.validated_data[
                            'additional_hour_testing']) != default_value:
            HistoryOfChanges.objects.get_or_create(
                change_delta_actual_design=self.validated_data[
                    'additional_hour_design'],
                resulting_actual_design=self.validated_data[
                                            'additional_hour_design'] + self.instance.actual_design,
                change_delta_actual_development=self.validated_data[
                    'additional_hour_development'],
                resulting_actual_development=self.validated_data[
                                                 'additional_hour_development'] + self.instance.actual_development,
                change_delta_actual_testing=self.validated_data[
                    'additional_hour_testing'],
                resulting_actual_testing=self.validated_data[
                                             'additional_hour_testing'] + self.instance.actual_testing,
                change_time=timezone.now(),
                project=self.instance,
                owner=self.context.get('request').user
            )

        instance.actual_design += Decimal(validated_data.get(
            'additional_hour_design'))
        instance.actual_development += Decimal(validated_data.get(
            'additional_hour_development'))
        instance.actual_testing += Decimal(validated_data.get(
            'additional_hour_testing'))
        instance.changed_by = self.context.get('request').user

        instance.save()

        return instance


class ProjectCreateSerializer(ModelSerializer):
    url = serializers.URLField(source='get_api_history_url', read_only=True,
                               required=False)

    class Meta:
        model = Project
        fields = '__all__'

    def save(self, **kwargs):
        project = super(ProjectCreateSerializer, self).save(**kwargs)
        InitialDataOfProject.objects.get_or_create(
            initial_actual_design=self.data['actual_design'],
            initial_actual_development=self.data['actual_development'],
            initial_actual_testing=self.data['actual_testing'],
            project=project
        )

        if self.validated_data.get('tags'):
            TagAddingHistory.objects.get_or_create(
                tag=self.validated_data.get('tags'),
                project=project,
                time_to_add=timezone.now()
            )
        return project


class HistoryOfChangesSerializer(ModelSerializer):
    view_changes = serializers.URLField(source='get_api_absolute_url', )
    project = SerializerMethodField()
    owner = SerializerMethodField()

    class Meta:
        model = HistoryOfChanges
        fields = [
            'id',
            'project_id',
            'change_time',
            'project',
            'owner',
            'view_changes',
        ]
        read_only_fields = ['change_time', 'project', 'owner', 'project_id', ]

    def get_project(self, obj):
        return obj.project.title

    def get_owner(self, obj):
        return obj.owner.username


class InitialDataOfProjectSerializer(ModelSerializer):
    project = SerializerMethodField()

    class Meta:
        model = InitialDataOfProject
        fields = [
            'initial_actual_design',
            'initial_actual_development',
            'initial_actual_testing',
            'project',
        ]

    def get_project(self, obj):
        return obj.project.title


class HistoryOfChangesDetailSerializer(ModelSerializer):
    initial_data = serializers.URLField(source='get_initial_data_url', )
    project_id = SerializerMethodField()

    class Meta:
        model = HistoryOfChanges
        fields = [
            'project_id',
            'initial_data',
            'change_delta_actual_design',
            'resulting_actual_design',
            'change_delta_actual_development',
            'resulting_actual_development',
            'change_delta_actual_testing',
            'resulting_actual_testing',
        ]

    def get_project_id(self, obj):
        return obj.project.id


class TagSerializer(ModelSerializer):

    class Meta:
        model = Tag
        fields = (
            'id',
            'title'
        )


class TagAddingHistorySerializer(ModelSerializer):
    project = SerializerMethodField()

    class Meta:
        model = TagAddingHistory
        fields = (
            'tag',
            'project',
            'time_to_add'
        )

    def get_project(self, obj):
        return obj.project.title


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RegisterSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
                                        validated_data['username'],
                                        validated_data['email'],
                                        validated_data['password']
                                        )
        return user


class LoginSerializer(ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField()

    class Meta:
        model = User
        fields = (
            'username',
            'password',
        )

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError('Incorrect credentials')