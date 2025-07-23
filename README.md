# FDM (Fine Data Mine)

## Overview  
Docker 환경을 활용한 파인 데이터 거래 플랫폼 프로젝트입니다.

## Tech Stack  
- **Language:** Node.js, HTML, CSS
- **Main Frameworks/Libraries:**  
  - **Node.js**: 백엔드 및 서비스 로직  
  - **Express.js**: REST API 및 서버 프레임워크  
  - **MySQL**: 관계형 데이터베이스  
  - **Nginx**: 웹 서버/리버스 프록시  
  - **MiniO**: 오브젝트 스토리지  
  - **Truffle**: 스마트 컨트랙트 배포 및 블록체인 개발  
  - **Docker**: 전체 환경 컨테이너화 및 관리  
  - **docker-compose**: 다중 컨테이너 오케스트레이션

## Description  
이 프로젝트는 Node.js 기반의 온라인 데이터 마이닝 서비스/플랫폼 구현을 목표로 하며,  
백엔드, 프론트엔드, 데이터베이스, 오브젝트 스토리지, 웹 서버(nginx), 블록체인 스마트 컨트랙트(truffle)까지 다양한 인프라가 Docker 컨테이너 환경에서 통합적으로 동작하도록 구성되어 있습니다.

## Directory  
- `/backend` : Node.js 기반 백엔드 서비스 및 API 소스  
- `/frontend` : 프론트엔드(웹) 소스 코드  
- `/init` : 초기화 스크립트 및 환경 설정  
- `/miniO` : 오브젝트 스토리지(MiniO) 관련 설정  
- `/mysql` : MySQL 데이터베이스 설정 및 초기 데이터  
- `/nginx` : 웹 서버 및 리버스 프록시 설정  
- `/truffle` : 스마트 컨트랙트 및 블록체인 연동 코드  
- `docker-compose.yaml` : 전체 서비스 도커 컴포즈 파일  
- `README.md` : 프로젝트 설명 및 가이드

## Installation & Usage  
1. node_modules를 포함한 모든 파일을 다운로드 받습니다.
2. 파일의 압축을 해제합니다.
3. 메모장을 관리자 권한으로 실행한 후 C:\Windows\System32\drivers\hosts를 열어 아래 내용을 추가합니다. (리버스 프록시 설정에 사용합니다.)
127.0.0.1    fdm.com

4. docker-compose.yaml이 있는 폴더에서 docker-compose up -d 명령어로 빌드합니다.
5. docker network inspect docker network inspect fdm_app-network로 네트워크에 모든 컨테이너가 포함되어 있는지 확인합니다.
6. 포함되어 있지 않다면,
docker network connect fdm_app-network backend-container; docker network connect fdm_app-network frontend-container; docker network connect fdm_app-network mysql-container; docker network connect fdm_app-network nginx-## container; docker network connect fdm_app-network image-container로 네트워크에 컨테이너를 포함시켜 줘야 합니다.
7. http://fdm.com:80 으로 접속하여 접속이 잘 되는지 확인합니다. 테스트용으로 loginid : m, password : m 의 관리자 계정이 sql 생성 시 기본으로 생성됩니다. (https는 지원하지 않습니다.)
8. Minio 설정을 위해 호스트 ip:9001(MiniO 관리 포트)로 접근하여 id: minioadmin, pw: minioadmin으로 로그인합니다.
9. uploads 버킷을 생성하고, 권한을 public으로 설정합니다.

10. 설치가 완료되었습니다! 아래는 기능 설명입니다.
11. 로그인하지 않은 사용자는 게시판 글을 볼 수만 있고, 파일 업로드도 가능하지만 포인트는 지급되지 않습니다.
11. 로그인 한 사용자(manager 포함)은 게시판 글을 작성할 수 있고, 본인이 쓴 글에 한해서 삭제가 가능하며, 비밀번호가 일치할 경우 수정도 가능합니다.
11. 관리자는 모든 글에 대해서 수정/삭제가 비밀번호 없이 가능합니다.
12. 모든 사용자는 이미지 업로드 시 포인트가 10 지급되며, 이는 home에서 확인할 수 있습니다.
* 이 프로젝트는 Docker desktop 환경에서 개발되었습니다.

## Contact  
문의: sincelife777@gmail.com (illuminateP)
