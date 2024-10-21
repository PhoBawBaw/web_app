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


