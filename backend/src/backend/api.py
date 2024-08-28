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
from django.http import StreamingHttpResponse
import struct
import time


from .serializers import (
    UserChangePasswordErrorSerializer,
    UserChangePasswordSerializer,
    UserCreateErrorSerializer,
    UserCreateSerializer,
    UserCurrentErrorSerializer,
    UserCurrentSerializer,
)

User = get_user_model()

def video_stream_generator():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect(('host.docker.internal', 44100))  
        while True:
            header = s.recv(12)
            if not header:
                break

            _, _, data_len = struct.unpack('f f i', header)
            
            if data_len <= 0:
                continue

            string_data = s.recv(data_len)
            # frame
            data = np.frombuffer(string_data, dtype='uint8')
            frame = cv2.imdecode(data, cv2.IMREAD_COLOR)
            
            if frame is not None:
                # cv2.imshow('Received Frame', frame)
                # if cv2.waitKey(1) & 0xFF == ord('q'):
                #     break
                _, jpeg = cv2.imencode('.jpg', frame)
                frame = jpeg.tobytes()

                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

                time.sleep(0.1)  # FPS
                
def get_temperature_humidity():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect(('host.docker.internal', 44100))
        header = s.recv(12)
        if not header:
            return None

        temperature, humidity, _ = struct.unpack('f f i', header)
        return temperature, humidity

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
    
    @action(detail=False, methods=["get"], url_path="video-stream")
    def video_stream(self, request, *args, **kwargs):
        response = StreamingHttpResponse(video_stream_generator(), content_type='multipart/x-mixed-replace; boundary=frame')
        response['Cache-Control'] = 'no-cache'
        # response['Connection'] = 'keep-alive'
        # print(response)
        return response
    
    @action(detail=False, methods=["get"], url_path="temperature-humidity")
    def temperature_humidity(self, request, *args, **kwargs):
        data = get_temperature_humidity()
        
        if data:
            temperature, humidity = data
            
            ## get state
            
            state = 'hungry'
            
            return Response({
                'temperature': temperature,
                'humidity': humidity,
                'state': state
            })
        else:
            return Response({
                'error': 'Could not retrieve sensor data'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)