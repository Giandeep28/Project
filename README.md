# ✈️ SkyVoyage | The Future of Premium Aviation

SkyVoyage is a production-grade, full-stack flight booking ecosystem designed for luxury private and commercial aviation. Featuring the **Celestial Midnight** design system, it provides a high-end, seamless experience for modern travelers.

---

## ✨ Key Features

### 🏛️ The Celestial Midnight Experience
- **Premium Branding**: A sophisticated gold-on-black luxury aesthetic featuring the Golden Phoenix emblem.
- **Dynamic Themes**: Seamless transitions between "Radiant" (Light) and "Celestial Midnight" (Dark) modes.
- **Micro-interactions**: Smooth Framer Motion animations for a responsive, alive interface.

### 🍱 Stopover Extras Wizard
- **Regional Gastronomy**: Curated meal selections including Indian, Chinese, Continental, and South Indian cuisines.
- **Travel Amenities**: On-demand lounge access, fast-track security, and personalized cabin upgrades.
- **Integrated Checkout**: Seamless state management for add-ons during the booking flow.

### 🎫 Digital Check-In
- **QR Boarding Passes**: Instant generation of digital boarding passes with secure QR verification.
- **Voyage Summary**: Real-time flight tracking and baggage policy confirmation.
- **Seamless Retrieval**: Easy booking lookup via reference IDs and passenger details.

### 🤖 AI Concierge
- **Intelligent Assistant**: Real-time flight recommendations and 24/7 passenger support powered by a Python FastAPI microservice.

---

## 🏗️ Technical Architecture

SkyVoyage is built on a high-performance distributed architecture:

### 1. **The Voyager Interface (Frontend)**
- **Tech Stack**: React 19, Vite, Framer Motion, Lucide React, Tailwind CSS.
- **Features**: Interactive seat maps, luxury booking wizard, and real-time state management.
- **Port**: `5173`

### 2. **The Core Engine (Java Backend)**
- **Tech Stack**: Java 21, Servlets, Multithreading, JSON processing.
- **Features**: High-concurrency booking engine, real-time seat locking, and inventory management.
- **Port**: `8080`

### 3. **The AI Concierge (Python Backend)**
- **Tech Stack**: Python 3.11, FastAPI, Uvicorn.
- **Features**: Intelligent chatbot logic and personalized assistance services.
- **Port**: `8000`

---

## 🚀 Getting Started

### 1. **Initialize the Core Engine (Java)**
```powershell
cd "SkyVoyage/backend-java"
.\build.bat
```

### 2. **Start the Voyager Interface (React)**
```powershell
cd "SkyVoyage/frontend"
npm install
npm run dev
```

### 3. **Wake the AI Concierge (Python)**
```powershell
cd "SkyVoyage/backend-python"
pip install -r requirements.txt
python api/main.py
```

---

## 📂 Project Structure

- `SkyVoyage/frontend/`: React-based premium user interface.
- `SkyVoyage/backend-java/`: Core high-performance booking and business logic.
- `SkyVoyage/backend-python/`: AI-driven assistant and recommendation services.
- `SkyVoyage/database/`: Persistence layer and schema definitions.
- `Archive/`: Legacy versions and developmental prototypes.

---
*© 2026 SkyVoyage Aviation Group. Elevating the standard of travel.*

