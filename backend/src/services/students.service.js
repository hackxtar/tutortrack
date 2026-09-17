const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../db/database');

// Avatar color palette for new students
const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
  'bg-cyan-100 text-cyan-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
];

/**
 * Generates initials from a full name (e.g., "Rahul Sharma" → "RS").
 */
function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

/**
 * Lists students for a tutor with filtering, search, and pagination.
 */
function listStudents(tutorId, { status, search, page = 1, limit = 50 }) {
  const db = getDatabase();

  let query = 'SELECT * FROM Students WHERE tutorId = ?';
  const params = [tutorId];

  // Status filter
  if (status && status !== 'All') {
    query += ' AND status = ?';
    params.push(status);
  }

  // Search filter
  if (search) {
    query += ' AND (name LIKE ? OR parentName LIKE ? OR parentPhone LIKE ? OR course LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }

  // Get total count
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
  const { count: total } = db.prepare(countQuery).get(...params);

  // Pagination
  const offset = (page - 1) * limit;
  query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const students = db.prepare(query).all(...params);

  // Enrich with tutor name and follow-up info
  const tutor = db.prepare('SELECT name FROM Tutors WHERE id = ?').get(tutorId);
  const teacherName = tutor ? tutor.name : 'Unknown';

  const enriched = students.map((s) => {
    // Get latest non-done follow-up for this student
    const followUp = db.prepare(
      'SELECT type, dueLabel FROM FollowUps WHERE studentId = ? AND tutorId = ? AND isDone = 0 ORDER BY dueDate ASC LIMIT 1'
    ).get(s.id, tutorId);

    let nextFollowUp = 'All caught up';
    let followUpStatus = 'caught-up';
    if (followUp) {
      nextFollowUp = followUp.dueLabel || followUp.type;
      followUpStatus = followUp.type === 'Overdue' ? 'overdue' : followUp.type === 'Today' ? 'today' : 'none';
    }

    return {
      id: s.id,
      name: s.name,
      initials: s.initials,
      grade: s.grade,
      parentName: s.parentName,
      parentPhone: s.parentPhone,
      course: s.course,
      schedule: s.schedule,
      teacher: teacherName,
      status: s.status,
      nextFollowUp,
      followUpStatus,
      attendance: s.attendance,
      avatarColor: s.avatarColor,
    };
  });

  return { total, page: parseInt(page), data: enriched };
}

/**
 * Creates a new student enrolled under the tutor.
 */
function createStudent(tutorId, data) {
  const db = getDatabase();
  const id = `ST-${Date.now().toString().slice(-4)}`;
  const initials = getInitials(data.name);
  const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

  db.prepare(`
    INSERT INTO Students (id, tutorId, name, initials, grade, course, schedule, parentName, parentPhone, status, attendance, avatarColor)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', 100, ?)
  `).run(
    id, tutorId,
    data.name, initials, data.grade, data.course,
    data.schedule || null, data.parentName || null, data.parentPhone,
    avatarColor
  );

  return {
    data: {
      id,
      name: data.name,
      initials,
      grade: data.grade,
      course: data.course,
      parentName: data.parentName || null,
      parentPhone: data.parentPhone,
      status: 'Active',
      attendance: 100,
      avatarColor,
    },
  };
}

/**
 * Gets detailed info for a single student, including counts of notes and follow-ups.
 */
function getStudentDetail(tutorId, studentId) {
  const db = getDatabase();

  const student = db.prepare(
    'SELECT * FROM Students WHERE id = ? AND tutorId = ?'
  ).get(studentId, tutorId);

  if (!student) {
    return { error: 'Student not found.', status: 404 };
  }

  const tutor = db.prepare('SELECT name FROM Tutors WHERE id = ?').get(tutorId);
  const teacherName = tutor ? tutor.name : 'Unknown';

  const { count: recentNotesCount } = db.prepare(
    'SELECT COUNT(*) as count FROM ClassNotes WHERE studentId = ? AND tutorId = ?'
  ).get(studentId, tutorId);

  const { count: activeFollowUpsCount } = db.prepare(
    'SELECT COUNT(*) as count FROM FollowUps WHERE studentId = ? AND tutorId = ? AND isDone = 0'
  ).get(studentId, tutorId);

  return {
    data: {
      student: {
        id: student.id,
        name: student.name,
        initials: student.initials,
        grade: student.grade,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        course: student.course,
        schedule: student.schedule,
        teacher: teacherName,
        status: student.status,
        attendance: student.attendance,
        avatarColor: student.avatarColor,
      },
      recentNotesCount,
      activeFollowUpsCount,
    },
  };
}

module.exports = { listStudents, createStudent, getStudentDetail };
