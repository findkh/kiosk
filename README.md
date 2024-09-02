# Otter Coffee Kiosk Project

<p align="center">
  <img src="https://github.com/user-attachments/assets/50baaf9a-0321-4bf5-acf7-c3fce15be609" width="250" />
</p>

기존에 JavaScript로 구현한 키오스크 프로젝트에 백엔드 로직을 추가하여, 판매 관리, 주문 처리, 메뉴 관리 등의 주요 기능을 구현하였습니다.  
자바스크립트 프로젝트: https://findkh.github.io/JS_Project/01-Kiosk_Ediya/index.html

## 기간

1차 구현: 2024.08.27. ~ 2024.09.02.

## 기술 스택

- 백엔드: Spring Boot 3.2, MyBatis, PostgreSQL
- 프론트엔드: jQuery, Bootstrap, Chart.js, Thymeleaf
- 실시간 통신: WebSocket, SSE (Server-Sent Events)
- 개발 도구: STS (Spring Tool Suite), DBeaver

## 주요 기능

1. 대시보드
   - 판매 데이터 조회: 당일 및 월별 판매 금액과 건수 조회.
   - 차트 시각화: 연간 판매액과 가장 많이 팔린 메뉴를 차트로 시각화. (Chart.js 사용)
2. 주문 관리
   - 실시간 주문 관리: WebSocket을 사용하여 키오스크에서 들어오는 주문을 실시간으로 조회.
   - 주문 수락 및 처리: 주문 수락 후 메뉴가 완성되면, 주문 상태 모니터에서 해당 메뉴의 번호를 호출하는 기능.
   - 전체 주문 조회: 전체 주문 목록을 조회하는 기능.
   - 주문 상태 모니터: SSE를 통해 메뉴 완성 시 고객 호출 기능 구현.
3. 메뉴 관리
   - 메뉴 카테고리 관리: 메뉴 카테고리의 CRUD 기능 구현.
   - 메뉴 정보 관리: 메뉴 정보 및 이미지의 CRUD 기능 구현.
4. 키오스크 화면
   - 메뉴 조회 및 주문: 판매 메뉴를 고객이 조회하고 주문할 수 있는 화면 구현.

## 구현 화면

1. 대시보드
<p align="center">
  <img src="https://github.com/user-attachments/assets/55203dab-30a3-4ba3-a490-83b3fea0e732" width="500" />
</p>
2. 주문 관리
   - 실시간 주문 관리
   <p align="center">
     <img src="https://github.com/user-attachments/assets/47be959a-a158-4788-8ca9-3f6fbbd86e2b" width="500" />
   </p>
   - 전체 주문 조회
   <p align="center">
     <img src="https://github.com/user-attachments/assets/718b4b10-49c5-4817-a485-58fc679487e0" width="500" />
   </p>
   - 주문 상태 모니터
   <p align="center">
     <img src="https://github.com/user-attachments/assets/549daa0e-82c4-4c1c-b37b-09a39c589517" width="500" />
   </p>
3. 메뉴 관리
<p align="center">
  <img src="https://github.com/user-attachments/assets/1756c457-b05a-4d3f-b9af-b818d289a64f" width="500" />
</p>
4. 키오스크 화면
<p align="center">
  <img src="https://github.com/user-attachments/assets/6cb48aa0-dc64-42e5-ab36-95a6177daf84" width="500" />
</p>
5. 실시간 통신
<p align="center">
 <img src="https://github.com/user-attachments/assets/7dbce844-a5de-4704-a8e7-e2f52c7342de"  width="500" />
</p>

## 추후 개선 사항

- 사용자 인증 및 권한 관리 추가
  - Spring Security 도입: 관리자 로그인 및 권한 관리를 위해 Spring Security를 추가하여 인증 및 접근 제어 기능을 구현할 예정.
  - JWT 통합: JWT(Json Web Token)를 사용하여 사용자 인증 토큰 기반의 로그인 시스템을 구축, 무상태 인증을 통해 보안을 강화할 계획.
