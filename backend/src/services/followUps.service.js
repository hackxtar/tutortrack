const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../db/database');

/**
 * Determines follow-up type based on due date relative to today.
 */
function computeFollowUpType(dueDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  if (due < today) return 'Overdue';
  if (due.getTime() === today.getTime()) return 'Today';
  return 'Upcoming';
}

/**
 * Computes a human-readable due label (e.g., "Tomorrow, 4:00 PM").
 */
function computeDueLabel(dueDate, dueTime) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));
  const timeStr = dueTime ? formatTime(dueTime) : '';

  if (diffDays < -1) return `Overdue by ${Math.abs(diffDays)} days`;
  if (diffDays === -1) return 'Overdue (Yesterday)';
  if (diffDays === 0) return timeStr ? `Today, ${timeStr}` : 'Today';
  if (diffDays === 1) return timeStr ? `Tomorrow, ${timeStr}` : 'Tomorrow';
  
  const dateStr = due.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  return timeStr ? `${dateStr}, ${timeStr}` : dateStr;
}

/**
 * Formats 24h time to 12h (e.g., "16:00" → "4:00 PM").
 */
function formatTime(time) {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * Lists follow-ups for the tutor, optionally filtered by type or studentId.
 */
function listFollowUps(tutorId, { filter, studentId }) {
  const db = getDatabase();

  let query = 'SELECT f.*, s.name as studentName, s.grade, s.parentName, s.parentPhone FROM FollowUps f JOIN Students s ON f.studentId = s.id WHERE f.tutorId = ?';
  const params = [tutorId];

  if (filter && filter !== 'All') {
    query += ' AND f.type = ?';
    params.push(filter);
  }

  if (studentId) {
    query += ' AND f.studentId = ?';
    params.push(studentId);
  }

  // Exclude completed follow-ups by default (show active queue)
  query += ' AND f.isDone = 0';
  query += ' ORDER BY f.dueDate ASC, f.dueTime ASC';

  const followUps = db.prepare(query).all(...params);

  const data = followUps.map((f) => ({
    id: f.id,
    type: f.type,
    studentId: f.studentId,
    studentName: f.studentName,
    grade: f.grade,
    parentName: f.parentName,
    parentPhone: f.parentPhone,
    due: f.dueLabel || computeDueLabel(f.dueDate, f.dueTime),
    objective: f.objective,
    draft: f.draftMessage,
    isDone: Boolean(f.isDone),
  }));

  return { total: data.length, data };
}

/**
 * Creates a new scheduled follow-up.
 */
function createFollowUp(tutorId, fuData) {
  const db = getDatabase();

  // Verify student exists and belongs to tutor
  const student = db.prepare(
    'SELECT id, name FROM Students WHERE id = ? AND tutorId = ?'
  ).get(fuData.studentId, tutorId);

  if (!student) {
    return { error: 'Student not found.', status: 404 };
  }

  const id = `fu-${Date.now()}`;
  const type = computeFollowUpType(fuData.dueDate);
  const dueLabel = computeDueLabel(fuData.dueDate, fuData.dueTime);

  db.prepare(`
    INSERT INTO FollowUps (id, tutorId, studentId, type, dueDate, dueTime, dueLabel, objective, draftMessage, isDone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `).run(
    id, tutorId, fuData.studentId,
    type, fuData.dueDate, fuData.dueTime || null,
    dueLabel, fuData.objective, fuData.draftMessage || null
  );

  return {
    data: {
      id,
      type,
      studentId: fuData.studentId,
      studentName: student.name,
      due: dueLabel,
      objective: fuData.objective,
      isDone: false,
    },
  };
}

/**
 * Toggles a follow-up's completion status.
 */
function toggleFollowUpStatus(tutorId, followUpId, isDone) {
  const db = getDatabase();

  const followUp = db.prepare(
    'SELECT id FROM FollowUps WHERE id = ? AND tutorId = ?'
  ).get(followUpId, tutorId);

  if (!followUp) {
    return { error: 'Follow-up not found.', status: 404 };
  }

  db.prepare(
    'UPDATE FollowUps SET isDone = ?, updatedAt = datetime(\'now\') WHERE id = ?'
  ).run(isDone ? 1 : 0, followUpId);

  return {
    data: {
      id: followUpId,
      isDone: Boolean(isDone),
    },
  };
}

module.exports = { listFollowUps, createFollowUp, toggleFollowUpStatus };
