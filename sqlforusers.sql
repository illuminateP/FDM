use dockerProject;
drop table users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- 비밀번호
    sid INT UNSIGNED NOT NULL UNIQUE, -- 유저 식별자
    email VARCHAR(255) NOT NULL UNIQUE,
    token INT UNSIGNED DEFAULT 0, -- 화폐: 0부터 INT의 최대값까지
    idcreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 시간
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- 수정 시간
);
