from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from rest_framework import routers


from .api import UserViewSet

router = routers.DefaultRouter()
router.register("users", UserViewSet, basename="api-users")

urlpatterns = [
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
    ),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/", include(router.urls)),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("admin/", admin.site.urls),
]
if settings.DEBUG:
    urlpatterns += static(settings.RECORD_URL, document_root=settings.RECORD_ROOT)