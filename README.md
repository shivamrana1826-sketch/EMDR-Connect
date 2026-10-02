# EMDR Connect - EMDR Therapy Management System

A web-based healthcare management platform designed for Eye Movement Desensitization and Reprocessing (EMDR) therapists and patients. The system streamlines patient registrations, doctor management with image uploads, dynamic appointments, real-time status notifications, protected video consultation sessions, and confidential digital prescriptions.

---

## 🛠️ Technology Stack

- **Backend**: Java 21, Spring Boot 3.5, Spring Data JPA / Hibernate
- **Security**: Spring Security Crypto (BCrypt password hashing with backward compatibility)
- **Database**: MySQL 8.0 (`emdr_connect`)
- **Frontend**: Responsive HTML5, CSS3, JavaScript (Vanilla ES6+), FontAwesome 6
- **Build & Packaging**: Maven Wrapper (`mvnw`), Portable Multipart File Storage

---

## 👥 User Roles & Core Workflows

### 1. Patient Workflow
1. **Registration & Login**: Secure signup with duplicate email prevention and role-based redirection.
2. **Directory & Profiles**: Browse certified therapists dynamically loaded from MySQL with detailed profile modals.
3. **Appointment Booking**: Select doctor, date, time slot, and reason; triggers real-time `PENDING` notification.
4. **Patient Dashboard**:
   - Live notification center with unread badges and "Mark Read" actions.
   - Real-time appointment status tracker (`PENDING`, `CONFIRMED`, `REJECTED`, `COMPLETED`).
   - Gated **Join Consultation** button (strictly enabled only when confirmed).
   - Confidential **My Prescriptions** view.
   - Consultation session documentation log.

### 2. Doctor Workflow
1. **Login & Profile Sync**: Seamlessly syncs doctor user accounts to their professional profile—eliminating mismatches.
2. **Doctor Dashboard**:
   - Dynamic profile display (photo, qualification, experience, fee, biography, contact).
   - Real-time availability toggle (`Available` vs `Off Duty`).
   - **Isolated Appointments**: Doctors only see and manage appointments assigned to them.
   - **Confirm / Reject Actions**: Instantly update appointment status and automatically notify the patient.
   - **Start Consultation**: Direct entry into verified video session.
   - **Digital Prescriptions**: Quick link to issue prescriptions for assigned patients.

### 3. Administrator Workflow
1. **Doctor Management Portal** (`/admin/doctor-management.html`):
   - Add new therapists with custom profile photos via multipart file uploads.
   - Edit therapist qualifications, fees, biography, and credentials.
   - Toggle Active/Inactive or Available/Off-duty status.
   - Delete doctors with automated user account cleanup.

---

## 🔐 Consultation Access Control (Gating)

Consultation access is strictly verified on the backend:
- Direct access to `consultation.html` without an appointment or with an unconfirmed appointment returns **HTTP 403 Forbidden**.
- A secure lock screen blocks camera access until the assigned doctor marks the appointment as `CONFIRMED`.
- Once verified, the camera preview streams (`getUserMedia`), and clinical session notes can be saved.

---

## 📋 Default Credentials for Testing

| Role | Email | Password | Access URL |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@emdrconnect.com` | `admin123` | `http://localhost:8080/admin/doctor-management.html` |
| **Doctor (Dr. Rekha Gupta)** | `rekha@emdrconnect.com` | `password123` | `http://localhost:8080/doctor-dashboard.html` |
| **Doctor (Dr. Raj Patil)** | `raj@emdrconnect.com` | `password123` | `http://localhost:8080/doctor-dashboard.html` |
| **Doctor (Dr. Arjun Mehta)** | `arjun@emdrconnect.com` | `password123` | `http://localhost:8080/doctor-dashboard.html` |
| **Doctor (Dr. Shivam Rana)** | `shivam@emdrconnect.com` | `password123` | `http://localhost:8080/doctor-dashboard.html` |
| **Doctor (Dr. Ananya Roy)** | `ananya@emdrconnect.com` | `doctorpassword123` | `http://localhost:8080/doctor-dashboard.html` |
| **Patient (John Doe)** | `johndoe@example.com` | `mypassword123` | `http://localhost:8080/patient-dashboard.html` |

---

## 🗄️ Database Structure (`emdr_connect`)

1. **`users`**: `id`, `full_name`, `email` (unique), `password`, `role`, `phone`, `active`
2. **`doctors`**: `id`, `name`, `email` (unique), `phone`, `specialization`, `qualification`, `experience`, `biography`, `image_path`, `consultation_fee`, `active`, `available`, `user_id`
3. **`appointments`**: `id`, `patient_name`, `email`, `phone`, `doctor_name`, `doctor_email`, `appointment_date`, `appointment_time`, `reason`, `status`
4. **`prescriptions`**: `id`, `patient_name`, `email` (patient), `doctor_name`, `doctor_email`, `medicine`, `dosage`, `instructions`, `prescription_date`
5. **`consultations`**: `id`, `patient_name`, `email`, `doctor_name`, `doctor_email`, `consultation_date`, `consultation_time`, `notes`, `status`, `appointment_id`
6. **`notifications`**: `id`, `recipient_email`, `title`, `message`, `type`, `created_at`, `is_read`

---

## 🚀 How to Run the Application

### 1. Prerequisites
- Java JDK 21+
- MySQL Server 8.0+ running on port 3306
- Maven (or use included `./mvnw.cmd`)

### 2. Database Setup
Create database `emdr_connect` in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS emdr_connect;
```
Configure your credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/emdr_connect?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. Start the Server
Run from the root directory:
```bash
./mvnw.cmd spring-boot:run
```

### 4. Access the Website
Open your browser and navigate to:
**`http://localhost:8080`**
