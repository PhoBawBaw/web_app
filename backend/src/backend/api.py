from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from django.http import StreamingHttpResponse, FileResponse, HttpResponse
import time
import os 
from rest_framework.views import APIView
from django.http import HttpResponse, FileResponse
from django.conf import settings
from .models import EnvironmentData, StatusData, MovingStatusData
from .serializers import (
    UserChangePasswordErrorSerializer,
    UserChangePasswordSerializer,
    UserCreateErrorSerializer,
    UserCreateSerializer,
    UserCurrentErrorSerializer,
    UserCurrentSerializer,
    ModelImproveSerializer,
)
from django.http import JsonResponse


User = get_user_model()


HLS_OUTPUT_PATH = '/baby/stream'
HLS_STORE_OUTPUT_PATH = '/baby/record'
ADI_STORE_OUTPUT_PATH = '/baby/audio'

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
        elif self.action == "model_improve":
            return ModelImproveSerializer

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
            
    @action(detail=False, methods=["get"], url_path="state-store")
    def state_store(self, request, *args, **kwargs):
        recent_data = StatusData.objects.order_by('-datetime')[:100]
        data = [{"datetime": item.datetime, "status": item.crying} for item in recent_data]
        return JsonResponse(data, safe=False)
            
    @action(detail=False, methods=["get"], url_path="moving-status")
    def moving_status(self, request, *args, **kwargs):
        latest_data = MovingStatusData.objects.order_by('-datetime').first()
        
        datetime = latest_data.datetime 
        move_state = latest_data.state
        
        try:   
            return Response({
                'time': datetime,
                'state': move_state
            })
        except:
            return Response({
                'error': 'Could not retrieve sensor data'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    @action(detail=False, methods=["get"], url_path="moving-store")
    def moving_store(self, request, *args, **kwargs):
        recent_data = MovingStatusData.objects.order_by('-datetime')[:100]
        data = [{"datetime": item.datetime, "status": item.state} for item in recent_data]
        return JsonResponse(data, safe=False)
        
            
    @action(detail=False, methods=["get"], url_path="temperature-humidity")
    def temperature_humidity(self, request, *args, **kwargs):
        latest_data = EnvironmentData.objects.order_by('-datetime').first()

        temperature = latest_data.temperature
        humidity = latest_data.humidity
        try:   
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
            video_urls = [request.build_absolute_uri(f'{settings.RECORD_URL}{video}') for video in videos]
            return JsonResponse({"videos": video_urls}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    @action(detail=False, methods=["get"], url_path='audio-store')
    def audio_store(self, request, *args, **kwargs):
        try:
            audios = [f for f in os.listdir(ADI_STORE_OUTPUT_PATH) if f.endswith('.wav')]
            audio_urls = [request.build_absolute_uri(f'{settings.AUDIO_URL}{audio}') for audio in audios]
            return JsonResponse({"audios": audio_urls}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    @action(["post"], url_path='model-improve', detail=False)
    def model_improve(self, request, *args, **kwargs):
        serializer = ModelImproveSerializer(data=request.data)

        if serializer.is_valid():
            # Access validated data
            data = serializer.validated_data
            audio_file = data.get('audio_file')
            classification = data.get('classification')
            print(audio_file, classification)
            
            return Response({"message": "모델 개선이 완료되었습니다!"}, status=status.HTTP_200_OK)
