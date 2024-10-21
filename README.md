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
   git clone https://github.com/username/repository.git
   cd repository

2. Config 파일들을 설정한 후 Docker Compose를 사용하여 애플리케이션을 실행합니다.

    ```bash
    cp .env.backend.template .env.backend # set SECRET_KEY and DEBUG=1 for debug mode on
    cp .env.frontend.template .env.frontend # set NEXTAUTH_SECRET to a value "openssl rand -base64 32"
    docker-compose up
    ```

3. 프론트엔드 서버에 접속합니다:

    URL: http://localhost:3000

4. 백엔드 API 문서(Swagger)에 접속합니다:

    URL: http://localhost:8000/api/schema/swagger-ui/

## 주요 기능
  - 백엔드: Django와 DRF를 사용하여 API를 제공하며, PostgreSQL을 데이터베이스로 사용합니다.
  - 프론트엔드: Next.js와 React(TypeScript)를 사용하여 SPA(Single Page Application)를 구현합니다.
  - API 문서화: Swagger를 통해 API 문서를 자동 생성하여 제공합니다.

## 라이센스
  이 프로젝트는 MIT 라이센스를 따릅니다. 자세한 내용은 LICENSE 파일을 참조하세요.


