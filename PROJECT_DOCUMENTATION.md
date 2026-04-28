# CropDesk Frontend Project Documentation

Welcome to the technical documentation for the **CropDesk Frontend**. This document explains the project architecture, directory structure, data flow, and key components to help developers navigate and contribute to the codebase.

---

## 1. Directory Structure & Category Grouping

The project follows a modular React architecture where logic, state, and UI are clearly separated.

### 📁 `src/api`
- **Purpose**: The centralized gateway for all backend interactions.
- **Functionality**: Contains domain-specific modules (e.g., `auth.api.ts`, `dashboard.api.ts`). It uses an Axios `client.ts` configured with interceptors to automatically attach authentication tokens to headers.
- **Flow**: API methods are called by custom hooks to fetch raw data.

### 📁 `src/components`
- **Purpose**: Reusable UI elements and functional blocks.
- **Groupings**:
    - **`auth/`**: Security components like `ProtectedRoute.tsx`.
    - **`common/`**: Generic UI atoms like `BentoCard`, `LoadingSkeleton`, and `Toast`.
    - **`layout/`**: Structural elements like `AppSidebar.tsx` and `DashboardLayout.tsx`.
    - **`sections/`**: Large, feature-specific UI chunks (e.g., `FarmHealthSection`).

### 📁 `src/hooks`
- **Purpose**: To encapsulate business logic and state management.
- **Functionality**: Hooks like `useDashboardState.ts` manage data fetching, loading states, and UI interactions (like cycling through devices).
- **Usage**: Components call hooks to get the data they need to render.

### 📁 `src/pages`
- **Purpose**: Route entry points (URLs).
- **Usage in UI**: Orchestrates multiple sections. For example, `DashboardPage.tsx` imports and positions various sections like `WelcomeHeader` and `DeviceSection`.

### 📁 `src/contexts`
- **Purpose**: Global state shared across the entire app.
- **Functionality**: `AuthContext` manages user sessions, while `ToastContext` handles global notifications.

### 📁 `src/constants`
- **Purpose**: Single source of truth for static values.
- **Functionality**: Stores route paths, device types, and hardcoded UI labels to avoid "magic strings."

---

## 2. Special Attention Modules

### 🛡️ `ProtectedRoute.tsx` (Auth Flow)
- **What it is**: A high-level wrapper used in `App.tsx` to guard private routes.
- **Logic**: 
    1. Checks `isAuthenticated` from `AuthContext`.
    2. If **not authenticated**: Redirects to `/login`.
    3. If **authenticated**: Renders the `AppSidebar` and the requested page via `<Outlet />`.
- **Flow**: `Request → ProtectedRoute → Auth Check → (Redirect or Sidebar + Page)`.

### 🏗️ Layout Folder (UI Structure)
- **Purpose**: Defines the "skeleton" of the app.
- **Components**:
    - `AppSidebar`: The permanent navigation menu on the left.
    - `DashboardLayout`: A grid-based container that ensures sections are aligned and responsive.
- **Usage**: Wraps pages to provide a consistent look and feel.

### 🧩 Sections vs. Pages
- **Difference**: 
    - A **Page** is a destination (URL). It handles high-level orchestration.
    - A **Section** is a functional block (e.g., `DeviceSection`). 
- **Reasoning**: This separation allows us to test sections in isolation and swap them between different pages (e.g., Dashboard V1 and V2) without duplicating logic.

### 🎣 Hooks Usage Pattern
- **Pattern**: `Logic → Hook → Component → UI`.
- **Example**: 
    - Logic for fetching farm data lives in `useDashboardState`.
    - `DashboardPage` calls `useDashboardState`.
    - Data is passed as props to sections.
- **Benefit**: Keeps the UI components "dumb" and focused only on styling.

---

## 3. Data Flow Mapping

The application follows a one-way data flow:

1.  **API**: `dashboard.api.ts` (Fetches data from NestJS backend).
2.  **Hooks**: `useDashboardState.ts` (Stores data in state, handles loading/errors).
3.  **Components (Pages)**: `DashboardPage.tsx` (Receives data from hook).
4.  **UI (Sections)**: `FarmHealthSection.tsx` (Receives props and renders charts).

---

## 4. Suggested Improvements & Maintenance

### 💡 Potential Improvements
1.  **Consolidate Layouts**: Currently, layout logic is shared between `ProtectedRoute` and `DashboardLayout`. Moving all structural CSS to a single `AppLayout.tsx` would simplify maintenance.
2.  **Mock Data Cleanup**: Several hooks contain hardcoded mock data for weather and icons. These should be moved to the backend or `src/constants`.
3.  **Type Safety**: Centralize all TypeScript interfaces in `src/types/` to ensure consistency across the API and UI layers.

### 🧹 Redundancy Check
- `AppLayout.tsx`: Check if this is still being used or if its logic has been absorbed by `ProtectedRoute`.
- `DashboardV1`: If the team has moved to V2, consider deprecating V1 folders to reduce code bloat.

---

*This documentation is intended for onboarding and architectural reference.*
