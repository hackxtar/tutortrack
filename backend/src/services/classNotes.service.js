const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../db/database');

/**
 * Lists class notes for the tutor, optionally filtered by studentId.
 */
function listClassNotes(tutorId, { studentId, limit = 20 }) {
  const db = getDatabase();

  let query = 'SELECT * FROM ClassNotes WHERE tutorId = ?';
  const params = [tutorId];

  if (studentId) {
    query += ' AND studentId = ?';
    params.push(studentId);
  }

  query += ' ORDER BY sessionDate DESC, createdAt DESC LIMIT ?';
  params.push(parseInt(limit));

  const notes = db.prepare(query).all(...params);

  const data = notes.map((n) => {
    // Format date for display
    const dateObj = n.sessionDate ? new Date(n.sessionDate) : new Date(n.createdAt);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      id: n.id,
      studentId: n.studentId,
      date: dateStr,
      time: n.duration ? `${n.duration} session` : 'N/A',
      subject: n.subject,
      topic: n.topic,
      understanding: n.understanding,
      covered: n.covered,
      homework: n.homework,
      tutorNote: n.tutorNote || undefined,
    };
  });

  return { total: data.length, data };
}

/**
 * Creates a new class note (fast log / quick note).
 */
function createClassNote(tutorId, noteData) {
  const db = getDatabase();

  // Verify student exists and belongs to tutor
  const student = db.prepare(
    'SELECT id FROM Students WHERE id = ? AND tutorId = ?'
  ).get(noteData.studentId, tutorId);

  if (!student) {
    return { error: 'Student not found.', status: 404 };
  }

  const id = `CN-${Date.now()}`;
  const sessionDate = new Date().toISOString().split('T')[0]; // Today's date

  db.prepare(`
    INSERT INTO ClassNotes (id, tutorId, studentId, sessionDate, duration, subject, topic, understanding, covered, homework, tutorNote)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, tutorId, noteData.studentId, sessionDate,
    noteData.duration || null,
    noteData.subject || null,
    noteData.topic,
    noteData.understanding,
    noteData.covered || null,
    noteData.homework || null,
    noteData.tutorNote || null
  );

  // Format today for display
  const today = new Date();
  const dateStr = `Today, ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return {
    data: {
      id,
      studentId: noteData.studentId,
      date: dateStr,
      time: 'Just now',
      subject: noteData.subject || null,
      topic: noteData.topic,
      understanding: noteData.understanding,
      homework: noteData.homework || null,
    },
  };
}

module.exports = { listClassNotes, createClassNote };
