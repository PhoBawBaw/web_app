# 아기 모니터링 웹 애플리케이션

이 프로젝트는 실시간으로 분류 모델을 사용하여 아기의 상태를 분석하고, GRPC 서버를 통해 전달된 영상을 기반으로 사용자에게 아기의 현재 모습을 제공합니다. 사용자들은 웹 애플리케이션을 통해 아기의 실시간 영상을 시청할 수 있으며, 동시에 아기의 주변 환경인 온도와 습도를 모니터링할 수 있습니다. 모든 데이터는 서버로부터 수집되어 데이터베이스에 저장되며, 이를 통해 사용자는 과거의 데이터를 조회하거나 분석할 수 있습니다.

## 프로젝트 설정 및 실행

### 사전 요구 사항

이 프로젝트를 실행하기 위해서는 아래와 같은 환경들이 필요합니다:

- Docker (버전 20.10.22 이상)
- Docker Compose (버전 v2.15.1 이상)
- Ubuntu 20.04.6 LTS

### 실행 방법

1. 리포지토리를 클론합니다.

   ```bash
   git clone https://github.com/PhoBawBaw/web_app.git
   cd web_app

2. Config 파일들을 설정한 후 Docker Compose를 사용하여 애플리케이션을 실행합니다.

    ```bash
    cp .env.backend.template .env.backend # set SECRET_KEY and DEBUG=1 for debug mode on
    cp .env.frontend.template .env.frontend # set NEXTAUTH_SECRET to a value "openssl rand -base64 32"
    docker-compose up
    ```

3. 프론트엔드 서버에 접속합니다:

    URL: http://\<IP ADDR>:3000

4. 백엔드 API 문서(Swagger)에 접속합니다:

    URL: http://\<IP ADDR>:58000/api/schema/swagger-ui/

## 주요 기능
  - 백엔드: Django와 DRF를 사용하여 API를 제공하며, PostgreSQL을 데이터베이스로 사용합니다.
  - 프론트엔드: Next.js와 React(TypeScript)를 사용하여 SPA(Single Page Application)를 구현합니다.
  - API 문서화: Swagger를 통해 API 문서를 자동 생성하여 제공합니다.

## 백엔드 종속성

백엔드의 종속성 관리는 Poetry로 처리되며, `docker compose` 명령어를 통해 프로젝트를 시작할 때 새로운 종속성이 있는지 확인하고, 설치되지 않은 경우 Docker가 자동으로 설치합니다.

- **[djangorestframework](https://github.com/encode/django-rest-framework)** - REST API 지원
- **[djangorestframework-simplejwt](https://github.com/jazzband/djangorestframework-simplejwt)** - REST API용 JWT 인증
- **[drf-spectacular](https://github.com/tfranzel/drf-spectacular)** - OpenAPI 스키마 생성기
- **[django-unfold](https://github.com/unfoldadmin/django-unfold)** - Django 관리 패널 테마

### 백엔드에 새로운 종속성 추가 명령어

```bash
docker compose exec api poetry add djangorestframework
```

## 프론트엔드 종속성

프론트엔드 종속성 관리는 두 가지로 나뉩니다. 첫 번째는 모든 프로젝트에서 공통적으로 사용하는 종속성이고, 두 번째는 특정 프로젝트에만 적용되는 종속성입니다.

- **[next-auth](https://github.com/nextauthjs/next-auth)** - Next.js 인증
- **[react-hook-form](https://github.com/react-hook-form/react-hook-form)** - React 폼 처리
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Tailwind CSS 클래스 이름 관리
- **[zod](https://github.com/colinhacks/zod)** - 스키마 검증

### 글로벌 종속성 추가 명령어

```bash
docker compose exec web pnpm add react-hook-form -w
```

### 특정 앱에 종속성 추가 명령어

```bash
docker compose exec web pnpm --filter web add react-hook-form
```

## `docker-compose.yaml`에 새로운 사이트 추가

새로운 사이트를 추가하려면 `apps/` 디렉토리에 프로젝트를 생성하고, `docker-compose.yaml` 파일에 적절한 포트 설정을 추가해야 합니다.

```yaml
new_microsite:
  command: bash -c "pnpm install -r && pnpm --filter new_microsite dev"
  build:
    context: frontend
  volumes:
    - ./frontend:/app
  expose:
    - "3001" # 다른 포트
  ports:
    - "3001:3001"
  env_file:
    - .env.frontend
  depends_on:
    - api
```

## 인증

인증은 **django-simplejwt**와 **next-auth**를 사용하여 JWT 기반 REST 인증을 제공합니다. 백엔드에서는 기본 설정만 사용하며, 프론트엔드에서는 `frontend/web/src/lib/auth.ts` 파일이 인증 관련 로직을 처리합니다.

### 백엔드 사용자 계정 생성

1. Django 관리자 계정을 생성하려면 다음 명령어를 실행하십시오.

```bash
docker compose exec api poetry run python src/manage.py createsuperuser
```

2. 프론트엔드에서 사용자 계정을 등록할 수 있지만, 기본적으로 계정은 비활성 상태입니다. 관리자 계정으로 활성화해야 로그인이 가능합니다.

### 프론트엔드에서 인증된 경로 설정

프론트엔드에서 인증된 사용자만 접근할 수 있는 경로를 설정하려면, `getServerSession` 함수를 사용하여 인증 상태를 확인할 수 있습니다.

```tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const SomePageForAuthenticatedUsers = async () => {
  const session = await getServerSession(authOptions);

  if (session === null) {
    return redirect("/");
  }

  return <>content</>;
};
```

이 로직은 여러 페이지에 적용할 수 있으며, 레이아웃 파일에서도 동일하게 적용 가능합니다.

```tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const AuthenticatedLayout = async ({ children }: { children: React.ReactNode; }) => {
  const session = await getServerSession(authOptions);

  if (session === null) {
    return redirect("/");
  }

  return <>{children}</>;
};

export default AuthenticatedLayout;
```

## 백엔드 API 호출

프론트엔드의 `frontend/apps/web/src/actions/` 폴더에 서버 액션이 구현되어 있으며, 이를 통해 Django API 백엔드와 통신합니다.

### API 클라이언트

서버 액션과 Django 백엔드 간의 쿼리는 `openapi-typescript-codegen` 패키지로 생성된 API 클라이언트를 사용하여 처리됩니다. 기본 옵션과 인증 토큰을 이미 구현한 `getApiClient` 함수가 사용됩니다.

### OpenAPI 스키마 업데이트

백엔드에서 변경 사항이 발생하면 다음 명령어로 타입스크립트 스키마를 업데이트해야 합니다.

```bash
docker compose exec web pnpm openapi:generate
```

## 라이센스
  TBD
