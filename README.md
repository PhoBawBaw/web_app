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

    URL: http://\<IP ADDR>\:3000

4. 백엔드 API 문서(Swagger)에 접속합니다:

    URL: http://\<IP ADDR>\:58000/api/schema/swagger-ui/

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
  이 프로젝트는 MIT 라이센스를 따릅니다. 자세한 내용은 LICENSE 파일을 참조하세요.



