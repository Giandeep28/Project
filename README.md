# ✈️ SkyVoyage | The Future of Premium Aviation

SkyVoyage is a production-grade, full-stack flight booking ecosystem designed for luxury private and commercial aviation. This version has been consolidated into a high-performance distributed architecture.

## 🏗️ Consolidated Architecture

SkyVoyage is now structured as a clean Client-Server ecosystem:

### 1. **The Voyager Interface (Frontend)**
- **Source**: `client/`
- **Tech Stack**: React 19, Vite, Framer Motion, Lucide React.
- **Port**: `5173`
- **Service**: Primary UI for flight search, seat selection, and booking management.

### 2. **The Celestial Gateway (Gateway)**
- **Source**: `client/server.js`
- **Tech Stack**: Node.js, Express, MongoDB (Mongoose).
- **Port**: `3001`
- **Service**: Handles authentication, logging, and traffic routing to downstream microservices.

### 3. **The Core Engine (Backend)**
- **Source**: `server/`
- **Tech Stack**: Core Java, Maven.
- **Port**: `8080`
- **Service**: High-concurrency booking engine with multithreaded seat locking and real-time inventory management.

---

## 🚀 Getting Started

### 1. **Launch the Core Engine**
Navigate to `server/` and run the Java engine:
```bash
# In server directory
.\run-backend.bat
```

### 2. **Launch the Gateway**
Navigate to `client/` and start the Node.js server:
```bash
# In client directory
node server.js
```

### 3. **Launch the Voyager Interface**
Navigate to `client/` and start the development server:
```bash
# In client directory
npm run dev
```

---

## 📂 Project Structure

- `client/`: Unified Frontend and Gateway logic.
- `server/`: High-performance Java logic and seat coordination.
- `Archive/`: Legacy versions and monolithic demonstration files.

---
*© 2026 SkyVoyage Aviation Group. All Rights Secured.*
