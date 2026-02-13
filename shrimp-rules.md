# GrabNextDoor - AI Agent Development Guidelines

## 1. Project Architecture

### 1.1. Backend (`/src/main/java/com/grabnextdoor`)
- **MUST** follow a feature-based package structure.
- For a new feature `foo`, create the following packages:
    - `com.grabnextdoor.foo.controller`
    - `com.grabnextdoor.foo.service`
    - `com.grabnextdoor.foo.repository`
    - `com.grabnextdoor.foo.entity`
    - `com.grabnextdoor.foo.dto`

### 1.2. Frontend (`/src`)
- **MUST** use the following directory structure:
    - `/src/pages`: For page-level components corresponding to routes.
    - `/src/components`: For reusable UI components.
    - `/src/services`: For API call modules.
    - `/src/hooks`: For custom React hooks.
    - `/src/contexts`: For React Context providers.

## 2. Code Standards

### 2.1. Backend
- All Data Transfer Objects **MUST** use a `DTO` suffix.
    - **DO:** `ItemCreationRequestDTO`, `UserResponseDTO`
    - **DO NOT:** `ItemCreationRequest`, `UserView`

### 2.2. Frontend
- Component filenames **MUST** be `PascalCase`. (e.g., `ItemCard.tsx`)
- Custom hook filenames **MUST** start with `use`. (e.g., `useAuth.ts`)

### 2.3. Styling
- **MUST** use Tailwind CSS utility classes for all styling.
- **DO NOT** write custom CSS in `.css` or `.module.css` files unless required for complex, unsupported animations.
- **Example:**
    - **DO:** `<div className="p-4 bg-blue-500 rounded-lg"></div>`
    - **DO NOT:** Create a CSS file and write `.my-custom-div { padding: 1rem; ... }`

## 3. Core Functionality Implementation Standards

### 3.1. Location Data Handling (CRITICAL)
1.  **Database Storage:**
    - **MUST:** Store all geographic coordinates in a single MySQL `POINT` type column.
    - **ABSOLUTELY PROHIBITED:** Storing latitude and longitude in separate `DOUBLE` or `VARCHAR` columns.
2.  **JPA Entity:**
    - **MUST:** Use the `org.locationtech.jts.geom.Point` type for the location field in any entity.
3.  **Address to Coordinate Conversion:**
    - **MUST:** When a user's address is created or updated, you **MUST** call the designated `GeocodioService` to convert the postal code to a `Point` object before saving.
4.  **Distance-Based Search:**
    - **MUST:** Implement all distance-based filtering using a native JPQL `@Query`.
    - **MUST:** The query **MUST** use the `ST_Distance_Sphere` MySQL function.
    - **ABSOLUTELY PROHIBITED:** Implementing the Haversine formula or any other distance calculation logic within the Java application layer. This task must be delegated to the database.

## 4. External Libraries and Frameworks

- **JPA Spatial:** **MUST** use `hibernate-spatial` for all interactions with the `POINT` data type. Do not seek or implement alternatives.
- **Frontend State Management:** For MVP, **MUST** use only React Context API for global state (e.g., authentication status). **DO NOT** add Redux, Zustand, or any other state management library.
- **Frontend API Calls:** **MUST** use the native `fetch` API. **DO NOT** add `axios`.

## 5. AI Decision-Making Standards

### Scenario: Adding a non-location-based search filter (e.g., filter by price)

1.  Is the new filter based on geographic distance?
    - **YES:** This is a violation of Rule 3.1. Stop and re-evaluate. The core location query should not be altered for non-location data.
    - **NO:** Proceed.
2.  Modify the appropriate DTO (e.g., `ItemSearchRequestDTO`) to include the new filter fields (e.g., `minPrice`, `maxPrice`).
3.  Locate the Querydsl implementation for item searching (e.g., `ItemRepositoryCustomImpl`).
4.  Add a new `BooleanExpression` to dynamically build the query based on the new DTO fields.
5.  **WARNING:** **DO NOT** attempt to add this logic to the native JPQL query responsible for location filtering. Combine the results of the Querydsl query and the location query in the service layer if necessary.

## 6. Prohibited Actions Summary

- **DO NOT** store latitude/longitude in separate columns.
- **DO NOT** calculate distances in the Java application. Use the database.
- **DO NOT** add state management libraries (Redux, Zustand, etc.).
- **DO NOT** add `axios`.
- **DO NOT** write custom CSS files; use Tailwind CSS.
