# Toolyard - Construction Toolroom & Asset Tracking

A high-fidelity mobile app mockup designed for construction firms replacing toolroom whiteboards and paper service logs with a modern mobile app for iOS and Android. Field crews use it to log what they take, schedule equipment servicing, and track asset locations across job sites.

## Features
- **Realistic Phone Canvas**: 9:19.5 aspect ratio iPhone frame with titanium bezel, dynamic island, tactile side buttons, live iOS status bar, and home indicator.
- **Native iOS Patterns**: Large collapse-on-scroll titles, push/pop stack navigation with left-edge swipe back, gesture-dismissible bottom sheets, pull-to-refresh with amber spinner, and dynamic island notification banners.
- **Role-Based Access Control**:
  - **Admin**: Full control across operational screens, user management, and company settings.
  - **Site Supervisor**: Operational oversight, task assignment, and read-only locked view of company settings.
  - **Mechanic**: Service & asset maintenance focus, close-out work orders, photo inspection picker.
  - **Storekeeper**: Inventory check-in/out, QR scanning, stock adjustments.
- **Full Operational Workflows**:
  - **Home Dashboard**: Job site switcher, 4 critical KPI stat cards, "Needs Attention" overdue alerts, and live activity stream.
  - **Inventory**: Filter by Parts / Consumables / Equipment, search, stock level bars, swipe actions for Quick Check In/Out, item detail, and add/edit forms.
  - **QR/Barcode Camera Scanner**: Viewfinder simulation with corner guides, laser scan line, simulated 1.5s detection with pulse feedback, manual code entry, and flashlight toggle.
  - **Service & Maintenance**: Calendar and list views, recurring & engine-hour interval workflows, task close-out with mock photo capture, notes, and parts logging.
  - **Assets**: List and interactive SVG construction job site map with live pins, engine hours line chart, and inspection tracking with overdue sorting.
  - **Offline Sync Engine**: Simulates offline queuing and batch sync with status chips in the top bar.

## Tech Stack
- React 18+ & TypeScript
- Tailwind CSS
- Motion (Framer Motion)
- Zustand with localStorage persistence
- Lucide React icons

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to view the app.

### 3. Build for Production
```bash
npm run build
```

## Vercel Deployment
The project is configured for zero-config Vercel deployment with `vercel.json` handling SPA rewrites to `/index.html`:
```bash
vercel deploy
```
