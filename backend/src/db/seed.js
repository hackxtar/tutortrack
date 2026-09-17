/**
 * TutorTrack Database Seeder
 * Seeds the database with demo data matching the frontend's mock data (src/data.ts).
 * Run: npm run db:seed
 */
const bcrypt = require('bcryptjs');
const { getDatabase, closeDatabase } = require('./database');

async function seed() {
  const db = getDatabase();

  console.log('🌱 Seeding database...');

  // Clear existing data (order matters for FK constraints)
  db.exec('DELETE FROM FollowUps');
  db.exec('DELETE FROM ClassNotes');
  db.exec('DELETE FROM Students');
  db.exec('DELETE FROM Tutors');

  // --- Seed Tutor ---
  const passwordHash = await bcrypt.hash('SecurePassword123!', 10);
  db.prepare(`
    INSERT INTO Tutors (id, name, email, passwordHash, phone, subjects, autoReminderHours, autoDraftMissedSession, monthlyRenewalAlert)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'tu-9901',
    'Amit Sharma',
    'amit.sharma@tutortrack.app',
    passwordHash,
    '+91 98201 54321',
    'Physics, Math & Science',
    2, 1, 1
  );
  console.log('  ✔ Tutor created: amit.sharma@tutortrack.app / SecurePassword123!');

  // --- Seed Students ---
  const insertStudent = db.prepare(`
    INSERT INTO Students (id, tutorId, name, initials, grade, course, schedule, parentName, parentPhone, status, attendance, avatarColor)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const students = [
    ['ST-8821', 'tu-9901', 'Rahul Sharma', 'RS', 'ICSE Grade 10', 'Physics & Chemistry', '3x weekly (Mon, Wed, Fri)', 'Rajesh Sharma', '+91 98201 54321', 'Active', 92, 'bg-indigo-100 text-indigo-700'],
    ['ST-8822', 'tu-9901', 'Priya Shah', 'PS', 'CBSE Grade 12', 'Higher Mathematics', 'Calculus & Vectors', 'Neha Shah', '+91 98112 33445', 'Active', 80, 'bg-indigo-100 text-indigo-700'],
    ['ST-8823', 'tu-9901', 'Aarav Mehta', 'AM', 'CBSE Grade 9', 'Math Foundation', 'Geometry & Algebra', 'Vikram Mehta', '+91 98765 43210', 'Active', 95, 'bg-indigo-100 text-indigo-700'],
    ['ST-8824', 'tu-9901', 'Tanvi Deshmukh', 'TD', 'IGCSE Grade 10', 'Mathematics Extended', 'Trial Class Pending', 'Sunil Deshmukh', '+91 99887 66554', 'Lead', 0, 'bg-slate-100 text-slate-700'],
    ['ST-8825', 'tu-9901', 'Kabir Singhania', 'KS', 'Grade 11', 'Applied Physics', 'Mechanics & Waves', 'Pooja Singhania', '+91 91234 56789', 'Active', 100, 'bg-indigo-100 text-indigo-700'],
  ];

  const insertStudents = db.transaction(() => {
    for (const s of students) {
      insertStudent.run(...s);
    }
  });
  insertStudents();
  console.log(`  ✔ ${students.length} students seeded`);

  // --- Seed Class Notes ---
  const insertNote = db.prepare(`
    INSERT INTO ClassNotes (id, tutorId, studentId, sessionDate, duration, subject, topic, understanding, covered, homework, tutorNote)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const classNotes = [
    ['CN-1', 'tu-9901', 'ST-8821', '2024-10-23', '60m', 'Physics', 'Light - Reflection & Spherical Mirrors', 'Good Understanding',
      'Finished mirror formula derivations, worked through 4 ray diagram practice problems. Explained Cartesian sign conventions for concave and convex mirrors.',
      'Exercise 4.2 questions 1-8; re-draw concave mirror ray table without looking at reference textbook.',
      'Rahul grasped the sign convention well today. Needs slight speed improvement on math calculation with fractions. No calculator permitted in ICSE 10th.'],
    ['CN-2', 'tu-9901', 'ST-8821', '2024-10-19', '60m', 'Physics', "Refraction Index & Snell's Law", 'Needs Practice',
      "Introduced refractive index concept, absolute vs relative indices, and trigonometric ratios for Snell's law.",
      "Revise Snell's Law formula and solve sample paper set 1 (Questions 5 to 12).",
      null],
    ['CN-3', 'tu-9901', 'ST-8821', '2024-10-12', '60m', 'Physics', "Electric Current Basics & Ohm's Law", 'Excellent',
      "Conducted complete review of potential difference, Ohm's law, and V-I characteristic curves. Solved numerical problems on series and parallel circuits.",
      'Review notes.',
      null],
  ];

  const insertNotes = db.transaction(() => {
    for (const n of classNotes) {
      insertNote.run(...n);
    }
  });
  insertNotes();
  console.log(`  ✔ ${classNotes.length} class notes seeded`);

  // --- Seed Follow-Ups ---
  const insertFollowUp = db.prepare(`
    INSERT INTO FollowUps (id, tutorId, studentId, type, dueDate, dueTime, dueLabel, objective, draftMessage, isDone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const followUps = [
    ['fu-1', 'tu-9901', 'ST-8821', 'Overdue', '2024-10-23', '14:00', 'Overdue by 22 hrs',
      'Confirm reschedule for missed Saturday mechanics class & check homework submission.',
      "Hi Mr. Sharma, Amit here from TutorTrack. Checking in regarding Rahul's missed session on Saturday. Could we reschedule for this Friday at 5 PM? Also waiting on Ex 4.2.",
      0],
    ['fu-2', 'tu-9901', 'ST-8822', 'Today', '2024-10-24', '10:30', 'Today, 10:30 AM',
      'Check homework progress on Integration worksheet before evening class.',
      'Hello Mrs. Shah, reminding Priya to finish problems 4 through 9 from Chapter 7 before our 5 PM class.',
      0],
    ['fu-3', 'tu-9901', 'ST-8823', 'Today', '2024-10-24', '14:00', 'Today, 2:00 PM',
      "Ask about renewal for next month's 12-session block and share feedback.",
      "Hello Mr. Mehta, Amit here from TutorTrack. Hope Aarav is doing great with Foundation Math! Reaching out to confirm renewal for next month's 12-session block.",
      0],
    ['fu-4', 'tu-9901', 'ST-8824', 'Upcoming', '2024-10-25', '11:00', 'Tomorrow, 11:00 AM',
      'Check lab report notes & titration calculations before practicals.',
      'Hi Ananya, reminding you to verify titration notes before tomorrow practical session.',
      0],
    ['fu-5', 'tu-9901', 'ST-8825', 'Upcoming', '2024-10-26', '10:00', 'Saturday, 10:00 AM',
      'Share weekly progress summary and quiz result score with his father.',
      "Hello Mr. Verma, Amit here from TutorTrack. Sharing Rohan's weekly quiz performance score: 92/100.",
      0],
  ];

  const insertFollowUps = db.transaction(() => {
    for (const f of followUps) {
      insertFollowUp.run(...f);
    }
  });
  insertFollowUps();
  console.log(`  ✔ ${followUps.length} follow-ups seeded`);

  closeDatabase();
  console.log('\n✅ Database seeded successfully!');
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
