# 설치 가이드
## 1. node_modules를 포함한 모든 파일을 다운로드 받습니다.
## 2. 파일의 압축을 해제합니다.
## 3. host 파일을 관리자 권한으로 열어 우분투 리눅스의 ip를 gctask.com 도메인에 추가합니다(리버스 프록시 설정이 되어 있습니다.)
## 4. yaml 파일로 빌드합니다.
## 5. gctask.com:80 으로 접속하여 접속이 잘 되는지 확인합니다. 테스트용으로 loginid : m, password : m 의 관리자 계정이 sql 생성 시 기본으로 생성됩니다.
## 6. Minio 설정을 위해 호스트 ip:9001(MiniO 관리 포트)로 접근하여 id: minioadmin, pw: minioadmin으로 로그인합니다.
## 7. uploads 버킷을 생성하고, 권한을 public으로 설정합니다.
