# 설치 가이드
## 1. node_modules를 포함한 모든 파일을 다운로드 받습니다.
## 2. 파일의 압축을 해제합니다.
## 3. host 파일을 관리자 권한으로 열어 우분투 리눅스의 ip를 gctask.com 도메인에 추가합니다(리버스 프록시 설정이 되어 있습니다.)
## 4. yaml 파일로 빌드합니다.
## 5. docekr network inspect docker network inspect fdm_app-network로 네트워크에 모든 컨테이너가 포함되어 있는지 확인합니다.
## 6. 포함되어 있지 않다면,
## docker network connect fdm_app-network backend-container; docker network connect fdm_app-network frontend-container; docker network connect fdm_app-network mysql-container; docker network connect fdm_app-network nginx-## container; docker network connect fdm_app-network image-container로 네트워크에 컨테이너를 포함시켜 줘야 합니다.
## 7. http://gctask.com:80 으로 접속하여 접속이 잘 되는지 확인합니다. 테스트용으로 loginid : m, password : m 의 관리자 계정이 sql 생성 시 기본으로 생성됩니다. (https는 지원하지 않습니다.)
## 8. Minio 설정을 위해 호스트 ip:9001(MiniO 관리 포트)로 접근하여 id: minioadmin, pw: minioadmin으로 로그인합니다.
## 9. uploads 버킷을 생성하고, 권한을 public으로 설정합니다.

## 10. 설치가 완료되었습니다! 아래는 기능 설명입니다.
## 11. 로그인하지 않은 사용자는 게시판 글을 볼 수만 있고, 파일 업로드도 가능하지만 포인트는 지급되지 않습니다.
## 11. 로그인 한 사용자(manager 포함)은 게시판 글을 작성할 수 있고, 본인이 쓴 글에 한해서 삭제가 가능하며, 비밀번호가 일치할 경우 수정도 가능합니다.
## 11. 관리자는 모든 글에 대해서 수정/삭제가 비밀번호 없이 가능합니다.
## 12. 모든 사용자는 이미지 업로드 시 포인트가 10 지급되며, 이는 home에서 확인할 수 있습니다.
* 이 프로젝트는 Docker desktop 환경에서 개발되었습니다.
