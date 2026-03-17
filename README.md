# 🏥 CareHub - Hospital Appointment System

A comprehensive Full-Stack Hospital Management application designed to streamline the interaction between Patients, Doctors, and Administrators.

## 🌐 Live Deployment Links
| Component | Status | Link |
| :--- | :--- | :--- |
| **Frontend (Vercel)** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) | [Live Demo](https://hospital-appointment-system-theta.vercel.app) |
| **Backend (Render)** | ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white) | [API Server](https://hospital-appointment-system-1o4k.onrender.com) |
| **Code Quality** | ![SonarCloud](https://img.shields.io/badge/SonarCloud-F3702A?style=for-the-badge&logo=sonarcloud&logoColor=white) | [SonarCloud Analysis](https://sonarcloud.io/project/overview?id=NAGASRISWETHA22_Hospital-Appointment-System) |

---

## ✨ Features
### 👤 Patient Module
- **Registration & Login:** Secure JWT-based authentication.
- **Doctor Discovery:** Browse doctors by department (Dermatology, Cardiology, etc.).
- **Smart Booking:** View available time slots and book appointments instantly.
- **My Schedule:** Manage and track your personal appointments.

### 👨‍⚕️ Doctor Module
- **Dashboard:** Overview of daily schedules.
- **Slot Management:** Add, edit, or delete availability slots (Date/Time).
- **Appointment Tracking:** Monitor booked appointments in real-time.

### 🔑 Admin Module
- **Analytics:** Overall hospital performance stats.
- **User Management:** Register new doctors and manage existing users.
- **Department Control:** Organize hospital divisions.

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Axios
- **Backend:** Java 17, Spring Boot 3.x, Spring Security (JWT)
- **Database:** MySQL (Hosted on Aiven Cloud)
- **Tools:** Maven, SonarCloud, Git, VS Code

---

## 📂 Project Structure
```text
Hospital-Appointment-System/
├── hospital-backend/     # Spring Boot Source Code
│   ├── src/main/java/    # Controller, Service, Repository, Entity, Config
│   └── pom.xml           # Backend Dependencies
├── hospital-frontend/    # React Source Code
│   ├── src/components/   # UI Components
│   └── package.json      # Frontend Dependencies
└── README.md
