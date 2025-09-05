# High-Level Design (HLD) — ExpiryWise (FreshTrack)

## Overview
- Purpose: Track food expiry, reduce waste, suggest recipes, notify users.
- Platform: Responsive web app built with React, TypeScript, Vite, Tailwind, shadcn/ui.

## Architecture Diagram (summary)
- Client: React SPA → Contexts (Auth, Settings, Notifications)
- Backend (Firebase): Hosting, Authentication, Firestore, Cloud Functions
- AI: Google Gemini for image-to-JSON parsing
- Local: localStorage for notification history and settings cache
- Export: jsPDF + html2canvas for PDF; JSON export

## Core Modules
### 1) Authentication
- Firebase Auth (Email/Password + Google)
- `AuthContext` wraps app; exposes `login`, `signup`, `logout`, `loginWithGoogle`.

### 2) Inventory
- Firestore path: `users/{uid}/inventory/{itemId}`
- CRUD via `firebaseUtils` with uid-scoped operations.
- Robust date handling (YYYY-MM-DD internal).

### 3) AI Ingestion
- Upload image → Gemini prompt → parse items { name, qty, expiry }
- Fallback to manual entry if parse fails.

### 4) Recipes
- Static recipe DB with matching against inventory.
- Prioritizes expiring items; filters/search.

### 5) Notifications
- `NotificationContext` computes expiring/expired alerts.
- Settings-aware (reminderDays, quiet hours, channels).
- Persists history in localStorage.

### 6) Settings
- `SettingsContext` manages notification, display, privacy, account.
- Per-user persistence via `localStorage` keys with uid suffix.

### 7) Export
- JSON: inventory + settings + metadata.
- PDF: generated on client with jsPDF + html2canvas utility.

## Backend Services (Firebase)
- Hosting: serves SPA.
- Authentication: identity + tokens.
- Firestore: per-user collections; composite indexes as needed.
- Cloud Functions:
  - Scheduled: `checkExpiringItems` (daily expiry check)
  - Callable: `checkExpiringItemsCustom` (on-demand checks)

## Data Model (simplified)
```
users/{uid}/inventory/{itemId}:
  name: string
  category: string | null
  quantity: number
  unit: string | null
  imageUrl: string | null
  expiryDate: string (ISO, YYYY-MM-DD)
  createdAt: timestamp
  updatedAt: timestamp
  status: 'fresh' | 'expiring' | 'expired'
```

## Client-Side Structure
- Pages: Upload, Inventory, Recipes, Settings
- Components: `InventoryDashboard`, `RecipeSuggestions`, `NotificationDropdown`, `Settings`, `UploadSection`, `EditItemDialog`
- State: Contexts + component state; optional TanStack Query for async flows

## Key Flows
1. Login → fetch `users/{uid}/inventory` → render dashboard
2. Upload → Gemini parse → user confirms → save to Firestore
3. Notification generation (client, settings-aware)
4. Recipe suggestions based on current inventory and expiries
5. Export JSON/PDF; Clear All Data (Firestore + localStorage)

## Security
- Firestore Rules: allow read/write only when `request.auth.uid == uid` in path
- API keys in `.env` ignored by VCS; rotate on exposure
- Input validation for dates; minimal data exposure

## Reliability & Performance
- Graceful fallbacks on AI/network failures
- Lazy-loading heavy code (PDF utils)
- Batched reads; memoization for lists/recipes

## Observability
- Dev console logs; togglable analytics/crash reporting via settings

## Deployment
- Hosting: `firebase deploy`
- Functions: `firebase deploy --only functions`
- Social: OG/Twitter meta with custom icons and images

## Roadmap
- Import (JSON → Firestore)
- Push notifications (Web Push + FCM)
- Firebase Storage for item images
- Account deletion flow in-app
- Advanced analytics & insights

---
Generated for documentation. Print this Markdown to PDF if needed.
