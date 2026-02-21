# 📍 GrabNextDoor

**GrabNextDoor** is a peer-to-peer (P2P) rental platform centered around Canadian local communities. It promotes a sharing economy where users can borrow items they need occasionally from nearby neighbors, while lenders can monetize their idle resources.

"Borrow what you need, lend what you don't."

---

## 🚀 Key Goals
- **Cost Efficiency:** Reduce purchase costs and monetize idle household items.
- **Sustainability:** Minimize resource waste through a circular economy.
- **Community:** Build a trust-based network within local Canadian neighborhoods.

---

## 🛠 Tech Stack

### Backend
- **Java 21+** (Spring Boot 3.4+)
- **JPA & Querydsl 5.0** (Optimized location-based filtering)
- **MySQL** (Relational data management)
- **Maven** (Dependency management)

### Frontend
- **React** (TypeScript)
- **Tailwind CSS** (Utility-first responsive design)
- **Vite** (Build tool)

---

## ✨ Core Features

### 1. User & Location Management
- **Authentication:** Email and Social Login (Google, Apple).
- **Postal Code Verification:** Location-based services using Canadian Postal Codes.
- **Trust Score:** Reputation management based on transaction history and reviews.

### 2. Inventory & Search
- **Smart Search:** Filtering by distance (km), price range, and category using Querydsl.
- **Listing Management:** Photos, categories (tools, appliances, sports, etc.), and rental rates.
- **Availability Calendar:** Real-time booking availability.

### 3. Rental Workflow
- **Booking Request:** Select dates and request reservations.
- **In-app Chat:** Real-time communication for pickup and item condition checks.
- **Status Management:** State machine (Pending → Rented → Returned → Review).

### 4. Trust & Safety
- **Review System:** Mutual ratings for transparency.
- **Compliance:** Adherence to Canada's **PIPEDA** for privacy protection.

---

## 📂 Project Structure

```text
.
├── backend/          # Spring Boot application
│   ├── src/main/java # Source code
│   └── pom.xml       # Backend dependencies
├── frontend/         # React + Vite application
│   ├── src/          # Frontend source code
│   └── package.json  # Frontend dependencies
└── prd.md            # Product Requirements Document
```

---

## ⚙️ Getting Started

### Prerequisites
- JDK 21
- Node.js (v18+)
- MySQL

### Backend Setup
1. Navigate to the `backend` directory.
2. Configure your database settings in `src/main/resources/application.properties`.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🗺 Roadmap
- **Phase 1 (MVP):** Basic auth, location settings, item search, and chat.
- **Phase 2:** Stripe integration for CAD payments, ID verification, and push notifications.

---

## ⚖️ License
This project is proprietary and for internal use only.
