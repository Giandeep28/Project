# ✈️ SkyVoyage | The Future of Premium Aviation

SkyVoyage is a production-grade, full-stack flight booking ecosystem designed for luxury private and commercial aviation. This version is built on a high-performance distributed architecture.

## 🏗️ Project Architecture

SkyVoyage is structured as a distributed micro-ecosystem:

### 1. **The Voyager Interface (Frontend)**
- **Source**: `SkyVoyage/frontend/`
- **Tech Stack**: React 19, Vite, Framer Motion, Lucide React, Tailwind CSS.
- **Port**: `5173`
- **Service**: Primary UI for flight search, seat selection, and booking management.

### 2. **The Core Engine (Java Backend)**
- **Source**: `SkyVoyage/backend-java/`
- **Tech Stack**: Core Java, Multithreading.
- **Port**: `8080`
- **Service**: High-concurrency booking engine with real-time seat locking and inventory management.

### 3. **The AI Concierge (Python Backend)**
- **Source**: `SkyVoyage/backend-python/`
- **Tech Stack**: Python, FastAPI, Uvicorn.
- **Port**: `8000`
- **Service**: Intelligent chatbot for personalized flight recommendations and passenger assistance.

---

## 🚀 Getting Started

### 1. **Launch the Core Engine**
Navigate to the Java backend directory and run the build script:
```powershell
cd "SkyVoyage/backend-java"
.\build.bat
```

### 2. **Launch the Voyager Interface**
Navigate to the frontend directory and start the development server:
```powershell
cd "SkyVoyage/frontend"
npm run dev
```

### 3. **Launch the AI Concierge**
Navigate to the Python backend directory and start the API:
```powershell
cd "SkyVoyage/backend-python"
python api/main.py
```

---

## 📂 Project Structure

- `SkyVoyage/frontend/`: React-based premium user interface.
- `SkyVoyage/backend-java/`: Core high-performance booking logic.
- `SkyVoyage/backend-python/`: AI-driven assistant services.
- `Archive/`: Legacy versions and developmental prototypes.

---
*© 2026 SkyVoyage Aviation Group. All Rights Secured.*
