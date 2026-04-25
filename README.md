# ✈️ SkyVoyage | The Future of Premium Aviation

SkyVoyage is a production-grade, full-stack flight booking ecosystem designed for luxury private and commercial aviation. This project implements a high-performance distributed architecture.

## 🏗️ Distributed Architecture

SkyVoyage is structured as a multi-service ecosystem:

### 1. **The Voyager Interface (Frontend)**
- **Source**: `SkyVoyage/frontend`
- **Tech Stack**: React 19, Vite, Framer Motion, Lucide React.
- **Port**: `5173`
- **Service**: Primary UI for flight search, seat selection, and booking management.

### 2. **The Core Engine (Java Backend)**
- **Source**: `SkyVoyage/backend-java`
- **Tech Stack**: Core Java (Multithreaded).
- **Port**: `8080`
- **Service**: High-concurrency booking engine with real-time inventory management and seat locking.

### 3. **The AI Concierge (Python Backend)**
- **Source**: `SkyVoyage/backend-python`
- **Tech Stack**: FastAPI, Uvicorn, Python.
- **Port**: `8000`
- **Service**: AI-powered assistant for flight queries and customer support.

---

## 🚀 Getting Started

### 1. **Launch the Core Engine (Java)**
Navigate to the Java backend directory and run the build script:
```powershell
cd "SkyVoyage/backend-java"
.\build.bat
```

### 2. **Launch the Voyager Interface (Frontend)**
Navigate to the frontend directory and start the development server:
```powershell
cd "SkyVoyage/frontend"
npm install
npm run dev
```

### 3. **Launch the AI Concierge (Python)**
Navigate to the Python backend directory and start the API:
```powershell
cd "SkyVoyage/backend-python"
python api/main.py
```

---

## 📂 Project Structure

- `SkyVoyage/frontend/`: The React-based web application.
- `SkyVoyage/backend-java/`: The high-performance Java booking engine.
- `SkyVoyage/backend-python/`: The AI-powered customer concierge service.
- `SkyVoyage/database/`: Shared data and storage files.
- `Archive/`: Legacy versions and historical project files.

---
*© 2026 SkyVoyage Aviation Group. All Rights Reserved.*
