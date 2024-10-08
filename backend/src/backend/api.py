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


from .serializers import (
    UserChangePasswordErrorSerializer,
    UserChangePasswordSerializer,
    UserCreateErrorSerializer,
    UserCreateSerializer,
    UserCurrentErrorSerializer,
    UserCurrentSerializer,
)

User = get_user_model()

# def get_temperature_humidity():
#     with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
#         s.connect(('host.docker.internal', 44100))
#         header = s.recv(12)
#         if not header:
#             return None

#         temperature, humidity, _ = struct.unpack('f f i', header)
#         return temperature, humidity

HLS_OUTPUT_PATH = '/app/stream'

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
    
    @action(detail=False, methods=["get"], url_path="temperature-humidity")
    def temperature_humidity(self, request, *args, **kwargs):
        # data = get_temperature_humidity()
        temperature = 30
        humidity = 40

        # if data:
            # temperature, humidity = data
            
            ## get state
        try:   
            state = 'hungry'
            
            return Response({
                'temperature': temperature,
                'humidity': humidity,
                'state': state
            })
        except:
            return Response({
                'error': 'Could not retrieve sensor data'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=["get"], url_path='stream/stream.m3u8')
    def stream_m3u8(self, request, *args, **kwargs):
        """
        stream.m3u8 파일 제공
        """
        file_path = os.path.join(HLS_OUTPUT_PATH, 'stream.m3u8')

        if not os.path.exists(file_path):
            return HttpResponse('File not found', status=404)
        return FileResponse(open(file_path, 'rb'), content_type='application/vnd.apple.mpegurl')

    # TS 세그먼트 파일 제공
    @action(detail=False, methods=["get"], url_path=r'stream/stream.m3u8/(?P<filename>[^/]+\.ts)')
    def stream_ts(self, request, filename, *args, **kwargs):
        """
        TS 세그먼트 파일 제공
        """
        file_path = os.path.join(HLS_OUTPUT_PATH, filename)
        if not os.path.exists(file_path):
            return HttpResponse('File not found', status=404)
        return FileResponse(open(file_path, 'rb'), content_type='video/mp2t')
