# 🩺 Doctor Tracker - Frontend Web Application

Modern administrative clinical dashboard built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **TanStack Query**, and **Recharts**.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 (`@theme` tokens & custom variants)
- **Data Fetching & Caching**: `@tanstack/react-query` with `keepPreviousData`
- **Charts & Visualizations**: `recharts` (Bar, Area, Donut, Specialization distribution)
- **Forms & Validation**: `react-hook-form` + `zod` + `@hookform/resolvers`
- **UI Components & Icons**: `lucide-react`, `sonner` toasts, `next-themes` (Dark/Light mode)
- **HTTP Client**: `axios` with `withCredentials: true` for HTTP-only cookie auth

---

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` from `.env.example`:
```ini
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📱 Features

- **Dashboard Overview**: 4 Animated KPI Stat Cards + 4 interactive Recharts charts + Recent admissions feed.
- **Doctor Directory**: Server-side multi-search, specialization/hospital filters, sorting, and pagination.
- **Doctor Profile Page**: Comprehensive profile view and managed patient roster with quick assignment modal.
- **Patient Management**: Full patient registry with URL search params synchronization and 300ms debounced searching.
- **Theme Switcher**: Smooth transitions between Dark and Light mode.
