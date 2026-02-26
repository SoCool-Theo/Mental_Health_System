# LYFE — Mental Health Clinic Management System

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2022-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Backend-Django-092E20?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Containerized-Docker-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
> A comprehensive, containerized full-stack web application designed to manage clinic operations, patient records, therapist schedules, and secure communications.

---

## 🏗️ System Architecture

This project uses a decoupled, Dockerized architecture to ensure isolated environments and seamless deployment.

| Layer | Technology |
|---|---|
| **Frontend** | Next.js (React), Axios, CSS Modules |
| **Backend** | Django, Django REST Framework (DRF) |
| **Database** | PostgreSQL |
| **Auth** | JWT Authentication |
| **Infrastructure** | Docker & Docker Compose |
| **Networking** | Tailscale (secure remote tunnel access) |

---

## ✨ Features

- **Role-Based Dashboards** — Distinct interfaces and access levels for Admins, Therapists, and Patients.
- **Secure Authentication** — JWT-based login and session management.
- **User Management** — Admins can onboard staff, register patients, and manage account statuses.
- **Profile Management** — Dynamic profile updates including secure image uploading.
- **Messaging System** — Integrated chat threads for secure communication between patients and their assigned therapists.
- **Dynamic Routing** — Environment variable-driven networking allowing seamless switching between `localhost` and Tailscale VPN IPs.

---

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (WSL2 backend required on Windows)
- [Tailscale](https://tailscale.com/) *(required only for remote network access or demos)*

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/SoCool-Theo/Mental_Health_System
cd Mental_Health_System
```

### 2. Configure Environment Variables

**Frontend** — Create a `.env.local` file inside the `frontend/` directory:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000/api/
```

> Replace `localhost` with your Tailscale IP if testing across multiple devices on a VPN.

**Backend** — Ensure your `backend/.env` file or `docker-compose.yml` includes the required PostgreSQL credentials (e.g. `POSTGRES_PASSWORD`).

### 3. Build and Start the Containers

```bash
docker compose up --build -d
```

### 4. Run Database Migrations

```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate

# Explicitly migrate custom apps
docker compose exec backend python manage.py makemigrations communications
docker compose exec backend python manage.py migrate
```

### 5. Create an Admin Superuser

```bash
docker compose exec backend python manage.py createsuperuser
```

---

## 🌐 Accessing the Application

| Service | URL |
|---|---|
| Frontend (Next.js) | `http://localhost:3000` |
| Backend API (Django) | `http://localhost:8000/api/` |

### Remote Demo via Tailscale

To access the app from another device on your Tailscale network, bridge the Docker ports from your host Linux environment:

```bash
sudo tailscale serve --bg --tcp 8000 tcp://127.0.0.1:8000
sudo tailscale serve --bg --tcp 3000 tcp://127.0.0.1:3000
```

Then update your `frontend/.env.local` with your Tailscale IP and rebuild:

```bash
docker compose up --build
```

---

## 🛠️ Useful Commands

| Command | Description |
|---|---|
| `docker compose down` | Stop all running containers |
| `docker compose logs -f` | Stream live container logs |
| `docker builder prune -a` | Clear build cache (fixes snapshot errors) |

---

## 📁 Project Structure

```
Mental_Health_System/
├── frontend/          # Next.js application
│   └── .env.local     # Frontend environment variables
├── backend/           # Django application
│   └── .env           # Backend environment variables
└── docker-compose.yml
```

