# 📍 Project: GrabNextDoor (PRD)

**GrabNextDoor** is a peer-to-peer (P2P) rental platform centered around Canadian local communities. Instead of purchasing items that are only needed occasionally, it aims for a sharing economy model where users can borrow from nearby neighbors and lenders can generate income.

---

## 1. Product Vision & Goals
* **Vision:** "Borrow what you need, lend what you don't."
* **Target Market:** Canada (Starting with high-density urban areas like Toronto, Vancouver, and Montreal).
* **Key Value:** 
    * **Cost Efficiency:** Reducing purchase costs and monetizing idle resources.
    * **Sustainability:** Minimizing resource waste.
    * **Community:** Building a trust-based neighbor network.

---

## 2. Target Audience
* **The Lender:** Households owning infrequently used camping gear, tools, party supplies, etc.
* **The Borrower:** Students, immigrants, and DIY enthusiasts who need items for the short term or want to try products before purchasing.

---

## 3. Tech Stack
| Category | Technology              | Details |
| :--- |:------------------------| :--- |
| **Backend** | Java , Spring Boot 3.4+ | Utilizing Virtual Threads and applying the latest Spring ecosystem |
| **Persistence** | JPA, Querydsl 5.0       | Optimizing complex dynamic queries and location-based filtering |
| **Frontend** | React, TypeScript       | Ensuring type safety and component-based development |
| **Styling** | Tailwind CSS            | Rapid UI implementation and responsive design via Utility-first CSS |
| **Database** | MySQL                   | Data integrity and relational data management |

---

## 4. Core Features (Functional Requirements)

### 4.1 User & Location Management
* **Authentication:** Email login and social login (Google, Apple).
* **Postal Code Verification:** Location registration and transaction radius setting based on Canadian Postal Codes (e.g., V6B 2W9).
* **Profile:** Management of 'Trust Score' indicating reliability and transaction history.

### 4.2 Inventory & Search
* **Listing:** Setting photos, titles, categories (tools, appliances, sports, etc.), daily rental rates, and security deposits.
* **Smart Search:** Providing filtering by distance (within $X$ km), price range, and category using Querydsl.
* **Availability Calendar:** Displaying bookable dates for each item.

### 4.3 Rental Workflow
* **Booking Request:** Selecting desired rental dates and submitting a reservation request.
* **In-app Chat:** Real-time chat for confirming pickup locations and item conditions.
* **Transaction Status:** State machine management: Pending -> Rented -> Returned -> Review Completed.

### 4.4 Trust & Safety
* **Review System:** Mutual reviews and ratings between lenders and borrowers.
* **Report:** Functionality to report inappropriate listings or users.

---

## 5. Non-Functional Requirements
* **Localization:** Multi-language support for English and French (considering expansion to Quebec).
* **Privacy:** Compliance with the Personal Information Protection and Electronic Documents Act (PIPEDA) in Canada.
* **Performance:** Returning fast search results through query optimization with Querydsl.
* **Mobile First:** Responsive web design considering the high proportion of mobile usage in Canada.

---

## 6. Roadmap

### Phase 1: MVP (Minimum Viable Product)
* Sign-up/Login and location settings.
* Item registration and dynamic search filtering.
* Basic chat functionality and rental status management.

### Phase 2: Professional Service
* **Stripe Integration:** CAD payment and security deposit holding system.
* **ID Verification:** Strengthening trust by introducing an identity verification system.
* **Notification:** Rental start/return notifications (Email/Push).

---

## 7. Mathematical Model (Query Example)
For location-based search, the Haversine formula, which calculates the distance ($d$) between two points using latitude ($\phi$) and longitude ($\lambda$), will be implemented as a Querydsl custom function.

$$d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\phi_2 - \phi_1}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\lambda_2 - \lambda_1}{2}\right)}\right)$$
