from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
import socket
import cv2
import numpy as np
import threading
from django.http import StreamingHttpResponse, FileResponse, HttpResponse
import struct
import time
import os 
from rest_framework.views import APIView
from django.http import HttpResponse, FileResponse
from django.conf import settings
from .models import EnvironmentData, StatusData
from .serializers import (
    UserChangePasswordErrorSerializer,
    UserChangePasswordSerializer,
    UserCreateErrorSerializer,
    UserCreateSerializer,
    UserCurrentErrorSerializer,
    UserCurrentSerializer,
)
from django.http import JsonResponse


User = get_user_model()


HLS_OUTPUT_PATH = '/app/stream'
HLS_STORE_OUTPUT_PATH = '/app/record'

class UserViewSet(
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = User.objects.all()
    serializer_class = UserCurrentSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def get_queryset(self):
        return self.queryset.filter(pk=self.request.user.pk)

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]

        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == "create":
            print('create action')
            return UserCreateSerializer
        elif self.action == "me":
            return UserCurrentSerializer
        elif self.action == "change_password":
            return UserChangePasswordSerializer

        return super().get_serializer_class()

    @extend_schema(
        responses={
            200: UserCreateSerializer,
            400: UserCreateErrorSerializer,
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        responses={
            200: UserCurrentSerializer,
            400: UserCurrentErrorSerializer,
        }
    )
    @action(["get", "put", "patch"], detail=False)
    def me(self, request, *args, **kwargs):
        if request.method == "GET":
            serializer = self.get_serializer(self.request.user)
            return Response(serializer.data)
        elif request.method == "PUT":
            serializer = self.get_serializer(
                self.request.user, data=request.data, partial=False
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        elif request.method == "PATCH":
            serializer = self.get_serializer(
                self.request.user, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

    @extend_schema(
        responses={
            204: None,
            400: UserChangePasswordErrorSerializer,
        }
    )
    @action(["post"], url_path="change-password", detail=False)
    def change_password(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.request.user.set_password(serializer.data["password_new"])
        self.request.user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(["delete"], url_path="delete-account", detail=False)
    def delete_account(self, request, *args, **kwargs):
        self.request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=["get"], url_path="baby-crying-status")
    def status(self, request, *args, **kwargs):
        latest_data = StatusData.objects.order_by('-datetime').first()
        
        datetime = latest_data.datetime 
        status = latest_data.crying
        
        try:   
            return Response({
                'time': datetime,
                'state': status
            })
        except:
            return Response({
                'error': 'Could not retrieve sensor data'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    @action(detail=False, methods=["get"], url_path="temperature-humidity")
    def temperature_humidity(self, request, *args, **kwargs):
        latest_data = EnvironmentData.objects.order_by('-datetime').first()

        temperature = latest_data.temperature
        humidity = latest_data.humidity
        try:   
            # state get
            
            return Response({
                'temperature': temperature,
                'humidity': humidity,
            })
        except:
            return Response({
                'error': 'Could not retrieve sensor data'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=["get"], url_path='stream/stream.m3u8')
    def stream_m3u8(self, request, *args, **kwargs):
        file_path = os.path.join(HLS_OUTPUT_PATH, 'stream.m3u8')

        if not os.path.exists(file_path):
            response = HttpResponse('File not found', status=404)
        else:
            response = FileResponse(open(file_path, 'rb'), content_type='application/vnd.apple.mpegurl')

        return response

    @action(detail=False, methods=["get"], url_path=r'stream/stream.m3u8/(?P<filename>[^/]+\.ts)')
    def stream_ts(self, request, filename, *args, **kwargs):
        file_path = os.path.join(HLS_OUTPUT_PATH, filename)
        if not os.path.exists(file_path):
            response = HttpResponse('File not found', status=404)
        else:
            response = FileResponse(open(file_path, 'rb'), content_type='video/mp2t')

        return response
    
    @action(detail=False, methods=["get"], url_path='stream-store')
    def stream_store(self, request, *args, **kwargs):
        try:
            videos = [f for f in os.listdir(HLS_STORE_OUTPUT_PATH) if f.endswith('.mp4')]
            video_urls = [request.build_absolute_uri(f'/media/record/{video}') for video in videos]

            return JsonResponse({"videos": video_urls}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)