# 📍 Project: GrabNextDoor (PRD)

**GrabNextDoor**는 캐나다 지역 사회를 중심으로 한 이웃 간 물건 대여(P2P Rental) 플랫폼입니다. 가끔씩만 필요한 물건을 새로 구매하는 대신, 가까운 이웃에게 빌려 쓰고 수익을 창출하는 공유 경제 모델을 지향합니다.

---

## 1. Product Vision & Goals
* **Vision:** "Borrow what you need, lend what you don't."
* **Target Market:** Canada (Starting with high-density urban areas like Toronto, Vancouver, and Montreal).
* **Key Value:** * **Cost Efficiency:** 구매 비용 절감 및 유휴 자원의 수익화.
    * **Sustainability:** 자원 낭비 최소화.
    * **Community:** 신뢰 기반의 이웃 네트워크 형성.

---

## 2. Target Audience
* **The Lender:** 사용하지 않는 캠핑 장비, 공구, 파티 용품 등을 소유한 가구.
* **The Borrower:** 단기적으로 물건이 필요하거나, 구매 전 제품을 경험해보고 싶은 학생, 이민자 및 DIY 취미 활동가.

---

## 3. Tech Stack
| Category | Technology              | Details |
| :--- |:------------------------| :--- |
| **Backend** | Java , Spring Boot 3.4+ | Virtual Threads 활용 및 최신 Spring 생태계 적용 |
| **Persistence** | JPA, Querydsl 5.0       | 복잡한 동적 쿼리 및 위치 기반 필터링 최적화 |
| **Frontend** | React, TypeScript       | 타입 안정성 확보 및 컴포넌트 기반 개발 |
| **Styling** | Tailwind CSS            | Utility-first CSS를 통한 빠른 UI 구현 및 반응형 대응 |
| **Database** | MySQL                   | 데이터 무결성 및 관계형 데이터 관리 |

---

## 4. Core Features (Functional Requirements)

### 4.1 User & Location Management
* **Authentication:** 이메일 로그인 및 소셜 로그인(Google, Apple).
* **Postal Code Verification:** 캐나다 특유의 Postal Code(예: V6B 2W9) 기반 위치 등록 및 거래 반경 설정.
* **Profile:** 신뢰도를 나타내는 'Trust Score' 및 거래 이력 관리.

### 4.2 Inventory & Search
* **Listing:** 사진, 제목, 카테고리(공구, 가전, 스포츠 등), 일일 대여료, 보증금 설정.
* **Smart Search:** Querydsl을 활용하여 거리($X$ km 이내), 가격대, 카테고리별 필터링 기능 제공.
* **Availability Calendar:** 물건별 예약 가능 날짜 표시.

### 4.3 Rental Workflow
* **Booking Request:** 대여 희망 날짜 선택 및 예약 신청.
* **In-app Chat:** 픽업 장소 및 물건 상태 확인을 위한 실시간 채팅.
* **Transaction Status:** 예약 중 -> 대여 중 -> 반납 완료 -> 리뷰 완료의 상태 머신 관리.

### 4.4 Trust & Safety
* **Review System:** 대여자와 빌리는 사람 간 상호 리뷰 및 평점 부여.
* **Report:** 부적절한 게시물이나 사용자 신고 기능.

---

## 5. Non-Functional Requirements
* **Localization:** 영어 및 프랑스어(Quebec 지역 확장 고려) 다국어 지원.
* **Privacy:** 캐나다 개인정보 보호법(PIPEDA) 준수.
* **Performance:** Querydsl을 통한 쿼리 최적화로 빠른 검색 결과 반환.
* **Mobile First:** 캐나다의 모바일 사용 비중을 고려한 반응형 웹 디자인.

---

## 6. Roadmap

### Phase 1: MVP (Minimum Viable Product)
* 회원가입/로그인 및 위치 설정.
* 물건 등록 및 동적 검색 필터링.
* 기본 채팅 기능 및 대여 상태 관리.

### Phase 2: Professional Service
* **Stripe Integration:** CAD 결제 및 보증금(Deposit) 홀딩 시스템.
* **ID Verification:** 본인 인증 시스템 도입으로 신뢰도 강화.
* **Notification:** 대여 시작/반납 알림 (Email/Push).

---

## 7. Mathematical Model (Query Example)
위치 기반 검색 시, 위도($\phi$)와 경도($\lambda$)를 이용해 두 지점 사이의 거리($d$)를 계산하는 Haversine 공식 등을 Querydsl 사용자 정의 함수로 구현할 예정입니다.

$$d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\phi_2 - \phi_1}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\lambda_2 - \lambda_1}{2}\right)}\right)$$
