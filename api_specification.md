# TutorTrack Backend API Specification

This document provides a complete, implementation-ready REST API specification for the **TutorTrack** web application, based on domain models, state management, and user flows analyzed across the codebase.

---

## Database Entities Overview

Before detailing the API endpoints, here are the underlying relational database entities referenced throughout the specification:

### 1. `Tutors`
- `id`: UUID (Primary Key)
- `name`: String(100)
- `email`: String(150) (Unique)
- `passwordHash`: String(255)
- `phone`: String(30)
- `subjects`: String(255)
- `autoReminderHours`: Integer (Default: 2)
- `autoDraftMissedSession`: Boolean (Default: true)
- `monthlyRenewalAlert`: Boolean (Default: true)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### 2. `Students`
- `id`: UUID (Primary Key)
- `tutorId`: UUID (Foreign Key → `Tutors.id`)
- `name`: String(100)
- `initials`: String(5)
- `grade`: String(50) (e.g., "ICSE Grade 10")
- `course`: String(100) (e.g., "Physics & Math")
- `schedule`: String(100)
- `parentName`: String(100)
- `parentPhone`: String(30)
- `status`: Enum (`'Active'`, `'Lead'`, `'Inactive'`)
- `attendance`: Integer (0-100 percentage)
- `avatarColor`: String(50)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### 3. `ClassNotes`
- `id`: UUID (Primary Key)
- `tutorId`: UUID (Foreign Key → `Tutors.id`)
- `studentId`: UUID (Foreign Key → `Students.id`)
- `sessionDate`: Date
- `duration`: String(20) (e.g., "60m")
- `subject`: String(100)
- `topic`: String(255)
- `understanding`: Enum (`'Excellent'`, `'Good Understanding'`, `'Needs Practice'`, `'Struggling'`)
- `covered`: Text
- `homework`: Text
- `tutorNote`: Text (Optional)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### 4. `FollowUps`
- `id`: UUID (Primary Key)
- `tutorId`: UUID (Foreign Key → `Tutors.id`)
- `studentId`: UUID (Foreign Key → `Students.id`)
- `type`: Enum (`'Overdue'`, `'Today'`, `'Upcoming'`)
- `dueDate`: Date
- `dueTime`: String(10) (e.g., "16:00")
- `dueLabel`: String(50) (e.g., "Today, 10:30 AM")
- `objective`: Text
- `draftMessage`: Text
- `isDone`: Boolean (Default: false)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

---

## 1. Authentication & Tutor Profile Endpoints

### 1.1 `Login Tutor`
1. **Name:** Login Tutor
2. **HTTP Method:** `POST`
3. **URL:** `/api/v1/auth/login`
4. **Purpose:** Authenticates a tutor using email and password and returns a JWT bearer token.
5. **Auth Requirement:** None (Public)
6. **Parameters:** None
7. **Request Body:**
   ```json
   {
     "email": "amit.sharma@tutortrack.app",
     "password": "SecurePassword123!"
   }
   ```
8. **Validation Rules:**
   - `email`: Required, valid email format.
   - `password`: Required, string min 6 characters.
9. **Success Response (200 OK):**
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "tutor": {
       "id": "tu-9901",
       "name": "Amit Sharma",
       "email": "amit.sharma@tutortrack.app",
       "phone": "+91 98201 54321",
       "subjects": "Physics, Math & Science"
     }
   }
   ```
10. **Error Responses:**
    - `400 Bad Request`: Missing email or password.
    - `401 Unauthorized`: Invalid email or password credentials.
11. **HTTP Status Codes:** `200`, `400`, `401`, `500`
12. **Database Entities:** `Tutors`

---

### 1.2 `Get Tutor Profile & Settings`
1. **Name:** Get Tutor Profile & Settings
2. **HTTP Method:** `GET`
3. **URL:** `/api/v1/tutor/profile`
4. **Purpose:** Retrieves the current authenticated tutor's profile details and notification preferences.
5. **Auth Requirement:** Required (`Bearer <JWT>`)
6. **Parameters:** None
7. **Request Body:** None
8. **Validation:** Valid JWT token in Authorization header.
9. **Success Response (200 OK):**
   ```json
   {
     "success": true,
     "data": {
       "id": "tu-9901",
       "name": "Amit Sharma",
       "email": "amit.sharma@tutortrack.app",
       "phone": "+91 98201 54321",
       "subjects": "Physics, Math & Science",
       "autoReminderHours": 2,
       "autoDraftMissedSession": true,
       "monthlyRenewalAlert": true
     }
   }
   ```
10. **Error Responses:**
    - `401 Unauthorized`: Invalid or expired JWT token.
    - `404 Not Found`: Tutor account not found.
11. **HTTP Status Codes:** `200`, `401`, `404`, `500`
12. **Database Entities:** `Tutors`

---

### 1.3 `Update Tutor Profile & Settings`
1. **Name:** Update Tutor Profile & Settings
2. **HTTP Method:** `PUT`
3. **URL:** `/api/v1/tutor/profile`
4. **Purpose:** Updates tutor personal details, WhatsApp contact number, and reminder preferences.
5. **Auth Requirement:** Required (`Bearer <JWT>`)
6. **Parameters:** None
7. **Request Body:**
   ```json
   {
     "name": "Amit Sharma",
     "subjects": "Physics, Math & Higher Calculus",
     "phone": "+91 98201 54321",
     "email": "amit.sharma@tutortrack.app",
     "autoReminderHours": 2,
     "autoDraftMissedSession": true,
     "monthlyRenewalAlert": true
   }
   ```
8. **Validation Rules:**
   - `name`: Required, non-empty string max 100 chars.
   - `phone`: Required, regex format validation `^\+?[0-9\s-]{10,15}$`.
   - `autoReminderHours`: Must be integer (1, 2, 4, 24).
9. **Success Response (200 OK):**
   ```json
   {
     "success": true,
     "message": "Preferences saved successfully",
     "data": {
       "id": "tu-9901",
       "name": "Amit Sharma",
       "subjects": "Physics, Math & Higher Calculus",
       "phone": "+91 98201 54321",
       "autoReminderHours": 2
     }
   }
   ```
10. **Error Responses:**
    - `400 Bad Request`: Validation failure on phone number or email format.
    - `401 Unauthorized`: Missing authentication.
11. **HTTP Status Codes:** `200`, `400`, `401`, `500`
12. **Database Entities:** `Tutors`

---

## 2. Students Directory Endpoints

### 2.1 `List Students`
1. **Name:** List Students
2. **HTTP Method:** `GET`
3. **URL:** `/api/v1/students`
4. **Purpose:** Retrieves a list of enrolled students for the authenticated tutor with status filtering, search querying, and pagination.
5. **Auth Requirement:** Required (`Bearer <JWT>`)
6. **Query Parameters:**
   - `status`: Optional Enum (`'All'`, `'Active'`, `'Lead'`, `'Inactive'`). Default: `'All'`
   - `search`: Optional String (Search across name, parentName, parentPhone, course)
   - `page`: Optional Integer. Default: `1`
   - `limit`: Optional Integer. Default: `50`
7. **Request Body:** None
8. **Validation Rules:**
   - `status` must be one of `All`, `Active`, `Lead`, `Inactive`.
9. **Success Response (200 OK):**
   ```json
   {
     "success": true,
     "total": 5,
     "page": 1,
     "data": [
       {
         "id": "ST-8821",
         "name": "Rahul Sharma",
         "initials": "RS",
         "grade": "ICSE Grade 10",
         "parentName": "Rajesh Sharma",
         "parentPhone": "+91 98201 54321",
         "course": "Physics & Chemistry",
         "schedule": "3x weekly (Mon, Wed, Fri)",
         "teacher": "Amit Sharma",
         "status": "Active",
         "nextFollowUp": "Overdue (Yesterday)",
         "followUpStatus": "overdue",
         "attendance": 92,
         "avatarColor": "bg-indigo-100 text-indigo-700"
       }
     ]
   }
   ```
10. **Error Responses:**
    - `401 Unauthorized`: Invalid token.
11. **HTTP Status Codes:** `200`, `401`, `500`
12. **Database Entities:** `Students`, `FollowUps`

---

### 2.2 `Create Student`
1. **Name:** Create Student
2. **HTTP Method:** `POST`
3. **URL:** `/api/v1/students`
4. **Purpose:** Enrolls a new student into the tutor's roster.
5. **Auth Requirement:** Required (`Bearer <JWT>`)
6. **Parameters:** None
7. **Request Body:**
   ```json
   {
     "name": "Samarth Patel",
     "grade": "Grade 10 • ICSE",
     "course": "Physics & Math",
     "parentName": "Suresh Patel",
     "parentPhone": "+91 98765 43210",
     "schedule": "Tue, Thu, Sat • 5:00 PM"
   }
   ```
8. **Validation Rules:**
   - `name`: Required, non-empty string.
   - `grade`: Required.
   - `course`: Required.
   - `parentPhone`: Required, phone format.
9. **Success Response (201 Created):**
   ```json
   {
     "success": true,
     "message": "Student added successfully",
     "data": {
       "id": "ST-8826",
       "name": "Samarth Patel",
       "initials": "SP",
       "grade": "Grade 10 • ICSE",
       "course": "Physics & Math",
       "parentName": "Suresh Patel",
       "parentPhone": "+91 98765 43210",
       "status": "Active",
       "attendance": 100,
       "avatarColor": "bg-emerald-100 text-emerald-700"
     }
   }
   ```
10. **Error Responses:**
    - `400 Bad Request`: Required field missing or phone format invalid.
    - `401 Unauthorized`: Token missing or invalid.
11. **HTTP Status Codes:** `201`, `400`, `401`, `500`
12. **Database Entities:** `Students`

---

### 2.3 `Get Student Detail`
1. **Name:** Get Student Detail
2. **HTTP Method:** `GET`
3. **URL:** `/api/v1/students/:id`
4. **Purpose:** Fetches complete record for a single student including course details, past class notes, and scheduled follow-ups.
5. **Auth Requirement:** Required (`Bearer <JWT>`)
6. **Path Parameters:**
   - `id`: Required UUID/String (Student ID)
7. **Request Body:** None
8. **Validation:** Student ID must exist and belong to the authenticated tutor.
9. **Success Response (200 OK):**
   ```json
   {
     "success": true,
     "data": {
       "student": {
         "id": "ST-8821",
         "name": "Rahul Sharma",
         "initials": "RS",
         "grade": "ICSE Grade 10",
         "parentName": "Rajesh Sharma",
         "parentPhone": "+91 98201 54321",
         "course": "Physics & Chemistry",
         "schedule": "3x weekly (Mon, Wed, Fri)",
         "teacher": "Amit Sharma",
         "status": "Active",
         "attendance": 92,
         "avatarColor": "bg-indigo-100 text-indigo-700"
       },
       "recentNotesCount": 3,
       "activeFollowUpsCount": 1
     }
   }
   ```
10. **Error Responses:**
    - `401 Unauthorized`: Invalid auth token.
    - `404 Not Found`: Student ID does not exist.
11. **HTTP Status Codes:** `200`, `401`, `404`, `500`
12. **Database Entities:** `Students`, `ClassNotes`, `FollowUps`

---

## 3. Class Notes & Fast Logger Endpoints

### 3.1 `List Class Notes`
1. **Name:** List Class Notes
2. **HTTP Method:** `GET`
3. **URL:** `/api/v1/class-notes`
4. **Purpose:** Fetches logged class notes filtered by student ID or recency.
5. **Auth Requirement:** Required (`Bearer <JWT>`)
6. **Query Parameters:**
   - `studentId`: Optional UUID/String
   - `limit`: Optional Integer (Default: 20)
7. **Request Body:** None
8. **Validation:** None
9. **Success Response (200 OK):**
   ```json
   {
     "success": true,
     "total": 3,
     "data": [
       {
         "id": "CN-1",
         "studentId": "ST-8821",
         "date": "Oct 23, 2024",
         "time": "5:00 PM - 6:00 PM",
         "subject": "Physics",
         "topic": "Light - Reflection & Spherical Mirrors",
         "understanding": "Good Understanding",
         "covered": "Finished mirror formula derivations...",
         "homework": "Exercise 4.2 questions 1-8",
         "tutorNote": "Rahul grasped the sign convention well today."
       }
     ]
   }
   ```
10. **Error Responses:** `401 Unauthorized`, `500 Internal Error`
11. **HTTP Status Codes:** `200`, `401`, `500`
12. **Database Entities:** `ClassNotes`, `Students`

---

### 3.2 `Create Class Note (Fast Log & Quick Note)`
1. **Name:** Create Class Note
2. **HTTP Method:** `POST`
3. **URL:** `/api/v1/class-notes`
4. **Purpose:** Logs a session observation note in under 30 seconds via modal or quick card.
5. **Auth Requirement:** Required (`Bearer <JWT>`)
6. **Parameters:** None
7. **Request Body:**
   ```json
   {
     "studentId": "ST-8821",
     "duration": "60m",
     "subject": "Physics",
     "topic": "Definite Integrals - Area Under Curves",
     "understanding": "Good Understanding",
     "homework": "Complete NCERT Exercise 7.4 Q1-12",
     "tutorNote": "Needs more attention during algebra fractions test"
   }
   ```
8. **Validation Rules:**
   - `studentId`: Required, valid student ID.
   - `topic`: Required, string max 255 chars.
   - `understanding`: Required, Enum (`'Excellent'`, `'Good Understanding'`, `'Needs Practice'`, `'Struggling'`).
9. **Success Response (201 Created):**
   ```json
   {
     "success": true,
     "message": "Class note saved successfully",
     "data": {
       "id": "CN-104",
       "studentId": "ST-8821",
       "date": "Today, Oct 24",
       "time": "Just now",
       "subject": "Physics",
       "topic": "Definite Integrals - Area Under Curves",
       "understanding": "Good Understanding",
       "homework": "Complete NCERT Exercise 7.4 Q1-12"
     }
   }
   ```
10. **Error Responses:**
    - `400 Bad Request`: Missing topic or student ID.
    - `404 Not Found`: Invalid student ID.
11. **HTTP Status Codes:** `201`, `400`, `404`, `500`
12. **Database Entities:** `ClassNotes`, `Students`

---

## 4. Scheduled Follow-ups & Communication Endpoints

### 4.1 `List Scheduled Follow-ups`
1. **Name:** List Scheduled Follow-ups
2. **HTTP Method:** `GET`
3. **URL:** `/api/v1/follow-ups`
4. **Purpose:** Retrieves the active follow-ups queue filtered by category (`Overdue`, `Today`, `Upcoming`) or completion status.
5. **Auth Requirement:** Required (`Bearer <JWT>`)
6. **Query Parameters:**
   - `filter`: Optional Enum (`'All'`, `'Overdue'`, `'Today'`, `'Upcoming'`). Default: `'All'`
   - `studentId`: Optional UUID/String
7. **Request Body:** None
8. **Validation:** None
9. **Success Response (200 OK):**
   ```json
   {
     "success": true,
     "total": 5,
     "data": [
       {
         "id": "fu-1",
         "type": "Overdue",
         "studentId": "ST-8821",
         "studentName": "Rahul Sharma",
         "grade": "Grade 10 • ICSE Physics",
         "parentName": "Rajesh Sharma",
         "parentPhone": "+91 98201 54321",
         "due": "Overdue by 22 hrs",
         "objective": "Confirm reschedule for missed Saturday mechanics class & check homework submission.",
         "draft": "Hi Mr. Sharma, Amit here from TutorTrack...",
         "isDone": false
       }
     ]
   }
   ```
10. **Error Responses:** `401 Unauthorized`, `500 Internal Error`
11. **HTTP Status Codes:** `200`, `401`, `500`
12. **Database Entities:** `FollowUps`, `Students`

---

### 4.2 `Create Scheduled Follow-up`
1. **Name:** Create Scheduled Follow-up
2. **HTTP Method:** `POST`
3. **URL:** `/api/v1/follow-ups`
4. **Purpose:** Schedules a new follow-up reminder and pre-drafted WhatsApp message for a parent.
5. **Auth Requirement:** Required (`Bearer <JWT>`)
6. **Parameters:** None
7. **Request Body:**
   ```json
   {
     "studentId": "ST-8821",
     "parentPhone": "+91 98201 54321",
     "dueDate": "2024-10-25",
     "dueTime": "16:00",
     "objective": "Confirm reschedule for missed class",
     "draftMessage": "Hi Mr. Sharma, Amit here from TutorTrack..."
   }
   ```
8. **Validation Rules:**
   - `studentId`: Required.
   - `dueDate`: Required, valid date (`YYYY-MM-DD`).
   - `objective`: Required, non-empty text.
9. **Success Response (201 Created):**
   ```json
   {
     "success": true,
     "message": "Follow-up scheduled successfully",
     "data": {
       "id": "fu-109",
       "type": "Upcoming",
       "studentId": "ST-8821",
       "studentName": "Rahul Sharma",
       "due": "Tomorrow, 4:00 PM",
       "objective": "Confirm reschedule for missed class",
       "isDone": false
     }
   }
   ```
10. **Error Responses:**
    - `400 Bad Request`: Missing objective or invalid date format.
    - `404 Not Found`: Student not found.
11. **HTTP Status Codes:** `201`, `400`, `404`, `500`
12. **Database Entities:** `FollowUps`, `Students`

---

### 4.3 `Toggle Follow-up Completed Status`
1. **Name:** Toggle Follow-up Completed Status
2. **HTTP Method:** `PATCH`
3. **URL:** `/api/v1/follow-ups/:id/status`
4. **Purpose:** Marks a follow-up task as completed or reopens it.
5. **Auth Requirement:** Required (`Bearer <JWT>`)
6. **Path Parameters:**
   - `id`: Required UUID/String (Follow-up ID)
7. **Request Body:**
   ```json
   {
     "isDone": true
   }
   ```
8. **Validation Rules:**
   - `isDone`: Required boolean.
9. **Success Response (200 OK):**
   ```json
   {
     "success": true,
     "message": "Follow-up status updated",
     "data": {
       "id": "fu-1",
       "isDone": true
     }
   }
   ```
10. **Error Responses:**
    - `400 Bad Request`: `isDone` missing or not boolean.
    - `404 Not Found`: Follow-up ID not found.
11. **HTTP Status Codes:** `200`, `400`, `404`, `500`
12. **Database Entities:** `FollowUps`

---

## 5. Dashboard Analytics & Summary Endpoints

### 5.1 `Get Dashboard Metrics & Quick Overview`
1. **Name:** Get Dashboard Metrics
2. **HTTP Method:** `GET`
3. **URL:** `/api/v1/dashboard/metrics`
4. **Purpose:** Aggregates statistics for top cards (overdue count, due today count, upcoming count, active student count, weekly lesson ratio).
5. **Auth Requirement:** Required (`Bearer <JWT>`)
6. **Parameters:** None
7. **Request Body:** None
8. **Validation:** Valid JWT token.
9. **Success Response (200 OK):**
   ```json
   {
     "success": true,
     "data": {
       "overdueCount": 1,
       "dueTodayCount": 2,
       "upcomingCount": 4,
       "activeStudentsCount": 18,
       "weeklyLessonRatio": {
         "completed": 14,
         "target": 18,
         "percentage": 78
       }
     }
   }
   ```
10. **Error Responses:** `401 Unauthorized`, `500 Internal Server Error`
11. **HTTP Status Codes:** `200`, `401`, `500`
12. **Database Entities:** `Students`, `FollowUps`, `ClassNotes`
