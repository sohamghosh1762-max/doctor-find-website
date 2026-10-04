<div align="center">

# 🩺 DoctorFind AI

### Production-Hardened AI-Powered Healthcare Platform & Smart Appointment Ecosystem

<p align="center">
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
<img src="https://img.shields.io/badge/Security-Hardened-emerald?style=for-the-badge&logo=shield"/>
</p>

---

### 🚀 Intelligent, Secure & Connected Healthcare

**DoctorFind AI** is an enterprise-ready, full-stack healthcare platform connecting **Patients**, **Verified Doctors**, and **Healthcare Administrators** in a unified, strictly secured ecosystem.

</div>

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Architecture & Technology Stack](#-architecture--technology-stack)
4. [Security & Access Control Matrix](#-security--access-control-matrix)
5. [AI-Assisted Preliminary Symptom Assessment](#-ai-assisted-preliminary-symptom-assessment)
6. [Real-World Location Services](#-real-world-location-services)
7. [Installation & Setup](#-installation--setup)
8. [Database Seeding](#-database-seeding)
9. [Environment Variables](#-environment-variables)
10. [API Reference](#-api-reference)
11. [Testing & Quality Verification](#-testing--quality-verification)
12. [Production Deployment](#-production-deployment)
13. [Medical Disclaimer](#-medical-disclaimer)

---

## 🌟 Project Overview

DoctorFind AI streamlines patient-doctor interactions, appointment scheduling, electronic medical records (EMR), digital prescriptions, and emergency/hospital discovery. The platform adheres to healthcare data privacy principles:
- **Strict Role Boundaries**: Public registration is locked to `patient`. Doctor profiles and Admin privileges are securely managed via authenticated workflows.
- **Resource Ownership Scoping**: Patients only access their own appointments, records, and prescriptions. Doctors only access records for patients under their care.
- **Privacy First**: Sensitive medical records are streamed via authenticated endpoints rather than public static directories.

---

## 🚀 Key Features

### 👤 Patient Portal
- **Doctor Directory & Booking**: Search verified specialists by clinical domain, hospital, location, and fees. Book online video consultations or in-person clinic slots.
- **Medical Records & Timeline**: View lab reports, diagnostic scans, and personal medical history with authenticated file streaming.
- **Digital Prescriptions**: Access active prescriptions, dosage instructions, and request 1-click refills.
- **AI Symptom Assessment**: Interactive symptom evaluation offering preliminary care recommendations, urgency levels, and suggested specialists.
- **Nearby Healthcare Locator**: Real-time geolocation-based discovery of verified hospitals, clinics, and pharmacies.

### 👨‍⚕️ Doctor Portal
- **Consultation Schedule**: Manage daily queues, approve/reschedule appointments, and conduct video consultations.
- **Availability Management**: Configure working hours, recurring days, and appointment slot durations.
- **Prescription Authoring**: Issue digital prescriptions tied to verified patient appointments.
- **Security & Credentials**: One-time secure credential setup with mandatory password changes.

### 🛡️ Admin Portal
- **Platform Analytics**: Monitor appointments, active users, specialty distribution, and monthly operational revenue.
- **Doctor Verification**: Review and approve/suspend doctor onboarding applications.
- **Facility Management**: Maintain directory of hospitals, clinics, pharmacies, and medicines.
- **Security Audit Logs**: Track authentication attempts, permission modifications, and administrative operations.

---

## 🏗 Architecture & Technology Stack

```text
┌───────────────────────────────────────────────────────────┐
│              Frontend (Client & SSR)                     │
│  React 19 • TypeScript 5.8 • TanStack Start • TailwindCSS │
│  Leaflet / OpenStreetMap • Lucide Icons • Framer Motion   │
└─────────────────────────────┬─────────────────────────────┘
                              │ HTTP / REST / JWT Bearer
┌─────────────────────────────▼─────────────────────────────┐
│                 Backend API Gateway                       │
│  Express.js • Helmet • CORS (Restricted) • Rate Limiters │
│  JWT Authentication • Role Middleware • Ownership Guards  │
│  Multer (Sanitized Private Storage) • Centralized Error   │
└─────────────────────────────┬─────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────┐
│                  Canonical Database                       │
│       MongoDB + Mongoose (Optimized Schema & Indexes)     │
└───────────────────────────────────────────────────────────┘
```

- **Frontend**: TanStack Start + React 19, TypeScript, Vite, TailwindCSS, Leaflet.
- **Backend**: Express.js REST API with modular controllers, centralized middleware, and rate limiting.
- **Database**: Canonical MongoDB with Mongoose schemas and compound indexes. (Legacy Prisma dependencies eliminated).

---

## 🔒 Security & Access Control Matrix

| Endpoint Group | Public | Patient | Doctor | Admin | Ownership Check |
|---|:---:|:---:|:---:|:---:|:---:|
| `POST /api/auth/register` | ✅ (patient only) | — | — | — | Role cannot be escalated |
| `POST /api/auth/login` | ✅ | ✅ | — | ✅ | Rate limited (15 req / 15m) |
| `POST /api/doctors/login` | ✅ | — | ✅ | — | Rate limited (15 req / 15m) |
| `GET /api/doctors` | ✅ | ✅ | ✅ | ✅ | Verified doctor listings |
| `POST /api/doctors` | ❌ | ❌ | ❌ | ✅ | Admin-only doctor onboarding |
| `GET /api/appointments` | ❌ | ✅ (own) | ✅ (assigned) | ✅ (all) | Verified by user/doctor ID |
| `POST /api/appointments` | ❌ | ✅ | ❌ | ✅ | Auto-assigns patient `_id` |
| `GET /api/medical-records`| ❌ | ✅ (own) | ✅ (treated) | ✅ | Strict ownership check |
| `GET /api/medical-records/:id/file`| ❌ | ✅ (own) | ✅ (treated) | ✅ | Authenticated binary stream |
| `POST /api/prescriptions`| ❌ | ❌ | ✅ | ✅ | Doctor/Admin only |
| `GET /api/admin/*` | ❌ | ❌ | ❌ | ✅ | Strict `isAdmin` authorization |
| `GET /api/notifications` | ❌ | ✅ (own) | ✅ (own) | ✅ (own) | Scoped strictly to `req.user._id` |

---

## 🧠 AI-Assisted Preliminary Symptom Assessment

The symptom assessment module provides **preliminary triage insights** and helps patients find the appropriate medical specialist.

> [!IMPORTANT]
> **Clinical & Safety Boundaries:**
> - The symptom checker **does NOT claim to diagnose diseases or replace licensed clinical examinations**.
> - Results are categorized by **Relevance & Urgency** (`High Concern`, `Moderate Concern`, `Low Concern`) rather than fabricated statistical probabilities.
> - High-risk/critical symptoms (e.g., severe chest pain, shortness of breath) immediately trigger prominent emergency warnings to seek urgent professional care (Dial 102/108/911).

---

## 📍 Real-World Location Services

DoctorFind AI utilizes **OpenStreetMap (OSM) Overpass API** alongside verified database records to retrieve real, physical hospitals and pharmacies based on user GPS coordinates. No synthetic or mathematically fabricated facility records are generated in production.

---

## 💻 Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally (`mongodb://localhost:27017/doctorfind`) or a MongoDB Atlas URI

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/doctor-find-website.git
cd doctor-find-website
```

### 2. Install All Dependencies
From the root folder, run:
```bash
npm run install:all
```
*(Or individually: `cd backend && npm install` and `cd frontend && npm install`)*

### 3. Setup Environment Files
- Copy [`backend/.env.example`](file:///Users/sohamghosh/doctor-find-website/backend/.env.example) to `backend/.env`
- Copy [`frontend/.env.example`](file:///Users/sohamghosh/doctor-find-website/frontend/.env.example) to `frontend/.env`

### 4. Run Development Servers
From the root directory, launch both backend and frontend concurrently:
```bash
npm run dev
```

Or run them individually:
```bash
# Terminal 1: Backend (port 5000)
npm run dev:backend

# Terminal 2: Frontend (port 5173)
npm run dev:frontend
```

---

## 🌿 Database Seeding

Populate the database with pre-configured administrators, verified doctors across specialties, sample patients, hospitals, pharmacies, medicines, and consultation appointments:

```bash
cd backend
npm run seed
```

### Default Seeded Test Credentials:
- **Admin**: `admin@doctorfind.com` / `Admin@12345`
- **Patient**: `rahul@example.com` / `Patient@12345`
- **Doctor (Cardiology)**: `dr.ananya@doctorfind.com` / `Doctor@12345`
- **Doctor (Neurology)**: `dr.rajesh@doctorfind.com` / `Doctor@12345`
- **Doctor (Pediatrics)**: `dr.sneha@doctorfind.com` / `Doctor@12345`

*(All accounts have strong, unique passwords hashed with bcrypt)*

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/doctorfind
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
GOOGLE_MAPS_API_KEY=your_optional_google_maps_key
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_optional_google_maps_key
```

---

## 📡 API Reference

### Authentication & Users
- `POST /api/auth/register` — Register as a patient (role escalation blocked)
- `POST /api/auth/login` — Patient / Admin login
- `POST /api/doctors/login` — Doctor credential login
- `GET /api/auth/profile` — Get authenticated user details
- `PUT /api/auth/change-password` — Change password

### Appointments & Telehealth
- `GET /api/appointments` — List appointments (scoped to authenticated user/doctor)
- `POST /api/appointments` — Book new consultation
- `PATCH /api/appointments/:id/reschedule` — Reschedule slot
- `DELETE /api/appointments/:id` — Cancel appointment
- `GET /api/video/consultation/:appointmentId` — Access secure Jitsi video room

### Medical Records & Prescriptions
- `GET /api/medical-records` — List patient records
- `POST /api/medical-records` — Upload new medical document (private storage)
- `GET /api/medical-records/:id/file` — Stream authenticated medical document
- `GET /api/prescriptions` — List active prescriptions
- `POST /api/prescriptions/:id/refill` — Request refill

### Facilities & AI Assessment
- `GET /api/location/nearby?lat=...&lng=...` — Real OSM & DB nearby facilities
- `POST /api/ai/symptom-analysis` — Clinical triage symptom assessment
- `GET /api/ai/history` — Patient symptom assessment history

---

## 🧪 Testing & Quality Verification

Run the verification suite across the codebase:

```bash
# Frontend TypeScript check
cd frontend
npx tsc --noEmit

# Frontend Production Build
npm run build

# Backend Syntax & Startup Check
cd ../backend
node -c src/app.js src/server.js src/controllers/*.js
```

---

## 🚢 Production Deployment

### Backend (e.g. Render / Railway / AWS ECS)
1. Build command: `npm install`
2. Start command: `node src/server.js`
3. Configure environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL=https://your-frontend-domain.com`).

### Frontend (e.g. Vercel / Netlify / Cloudflare Pages)
1. Build command: `npm run build`
2. Output directory: `dist/client`
3. Configure environment variable (`VITE_API_BASE_URL=https://your-backend-domain.com/api`).

---

## ⚖️ Medical Disclaimer

> [!CAUTION]
> **DoctorFind AI is an assistive technology platform and does not provide formal medical diagnoses or emergency medical intervention.**
> All symptom assessments and information provided on this platform are for educational and triage guidance purposes only. In case of acute medical emergencies, life-threatening symptoms, or severe trauma, immediately contact local emergency services (102 / 108 / 911) or visit the nearest hospital emergency department.

---

<div align="center">
  <sub>Built with ❤️ for modern, secure, and accessible healthcare.</sub>
</div>