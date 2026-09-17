-- TutorTrack Database Schema
-- SQLite DDL for all 4 core entities

CREATE TABLE IF NOT EXISTS Tutors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK(length(name) <= 100),
  email TEXT NOT NULL UNIQUE CHECK(length(email) <= 150),
  passwordHash TEXT NOT NULL,
  phone TEXT CHECK(length(phone) <= 30),
  subjects TEXT CHECK(length(subjects) <= 255),
  autoReminderHours INTEGER DEFAULT 2,
  autoDraftMissedSession INTEGER DEFAULT 1,   -- SQLite boolean (0/1)
  monthlyRenewalAlert INTEGER DEFAULT 1,       -- SQLite boolean (0/1)
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS Students (
  id TEXT PRIMARY KEY,
  tutorId TEXT NOT NULL,
  name TEXT NOT NULL CHECK(length(name) <= 100),
  initials TEXT CHECK(length(initials) <= 5),
  grade TEXT CHECK(length(grade) <= 50),
  course TEXT CHECK(length(course) <= 100),
  schedule TEXT CHECK(length(schedule) <= 100),
  parentName TEXT CHECK(length(parentName) <= 100),
  parentPhone TEXT CHECK(length(parentPhone) <= 30),
  status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Lead', 'Inactive')),
  attendance INTEGER DEFAULT 100 CHECK(attendance >= 0 AND attendance <= 100),
  avatarColor TEXT CHECK(length(avatarColor) <= 50),
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tutorId) REFERENCES Tutors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ClassNotes (
  id TEXT PRIMARY KEY,
  tutorId TEXT NOT NULL,
  studentId TEXT NOT NULL,
  sessionDate TEXT,
  duration TEXT CHECK(length(duration) <= 20),
  subject TEXT CHECK(length(subject) <= 100),
  topic TEXT CHECK(length(topic) <= 255),
  understanding TEXT CHECK(understanding IN ('Excellent', 'Good Understanding', 'Needs Practice', 'Struggling')),
  covered TEXT,
  homework TEXT,
  tutorNote TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tutorId) REFERENCES Tutors(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES Students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS FollowUps (
  id TEXT PRIMARY KEY,
  tutorId TEXT NOT NULL,
  studentId TEXT NOT NULL,
  type TEXT DEFAULT 'Upcoming' CHECK(type IN ('Overdue', 'Today', 'Upcoming')),
  dueDate TEXT,
  dueTime TEXT CHECK(length(dueTime) <= 10),
  dueLabel TEXT CHECK(length(dueLabel) <= 50),
  objective TEXT,
  draftMessage TEXT,
  isDone INTEGER DEFAULT 0,  -- SQLite boolean (0/1)
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tutorId) REFERENCES Tutors(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES Students(id) ON DELETE CASCADE
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_students_tutorId ON Students(tutorId);
CREATE INDEX IF NOT EXISTS idx_students_status ON Students(status);
CREATE INDEX IF NOT EXISTS idx_classnotes_tutorId ON ClassNotes(tutorId);
CREATE INDEX IF NOT EXISTS idx_classnotes_studentId ON ClassNotes(studentId);
CREATE INDEX IF NOT EXISTS idx_followups_tutorId ON FollowUps(tutorId);
CREATE INDEX IF NOT EXISTS idx_followups_studentId ON FollowUps(studentId);
CREATE INDEX IF NOT EXISTS idx_followups_type ON FollowUps(type);
CREATE INDEX IF NOT EXISTS idx_followups_isDone ON FollowUps(isDone);
