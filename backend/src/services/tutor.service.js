const { getDatabase } = require('../db/database');

/**
 * Retrieves tutor profile and settings by ID.
 */
function getTutorProfile(tutorId) {
  const db = getDatabase();
  const tutor = db.prepare(
    'SELECT id, name, email, phone, subjects, autoReminderHours, autoDraftMissedSession, monthlyRenewalAlert FROM Tutors WHERE id = ?'
  ).get(tutorId);

  if (!tutor) {
    return { error: 'Tutor account not found.', status: 404 };
  }

  return {
    data: {
      id: tutor.id,
      name: tutor.name,
      email: tutor.email,
      phone: tutor.phone,
      subjects: tutor.subjects,
      autoReminderHours: tutor.autoReminderHours,
      autoDraftMissedSession: Boolean(tutor.autoDraftMissedSession),
      monthlyRenewalAlert: Boolean(tutor.monthlyRenewalAlert),
    },
  };
}

/**
 * Updates tutor profile and notification preferences.
 */
function updateTutorProfile(tutorId, data) {
  const db = getDatabase();

  const existing = db.prepare('SELECT id FROM Tutors WHERE id = ?').get(tutorId);
  if (!existing) {
    return { error: 'Tutor account not found.', status: 404 };
  }

  const stmt = db.prepare(`
    UPDATE Tutors SET
      name = COALESCE(?, name),
      email = COALESCE(?, email),
      phone = COALESCE(?, phone),
      subjects = COALESCE(?, subjects),
      autoReminderHours = COALESCE(?, autoReminderHours),
      autoDraftMissedSession = COALESCE(?, autoDraftMissedSession),
      monthlyRenewalAlert = COALESCE(?, monthlyRenewalAlert),
      updatedAt = datetime('now')
    WHERE id = ?
  `);

  stmt.run(
    data.name || null,
    data.email || null,
    data.phone || null,
    data.subjects || null,
    data.autoReminderHours ?? null,
    data.autoDraftMissedSession != null ? (data.autoDraftMissedSession ? 1 : 0) : null,
    data.monthlyRenewalAlert != null ? (data.monthlyRenewalAlert ? 1 : 0) : null,
    tutorId
  );

  // Fetch updated record
  const updated = db.prepare(
    'SELECT id, name, email, phone, subjects, autoReminderHours FROM Tutors WHERE id = ?'
  ).get(tutorId);

  return {
    data: {
      id: updated.id,
      name: updated.name,
      subjects: updated.subjects,
      phone: updated.phone,
      autoReminderHours: updated.autoReminderHours,
    },
  };
}

module.exports = { getTutorProfile, updateTutorProfile };
