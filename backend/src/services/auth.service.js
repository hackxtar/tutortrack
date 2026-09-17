const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { getDatabase } = require('../db/database');

/**
 * Authenticates a tutor by email/password and returns a JWT token.
 */
function loginTutor(email, password) {
  const db = getDatabase();

  const tutor = db.prepare('SELECT * FROM Tutors WHERE email = ?').get(email);
  if (!tutor) {
    return { error: 'Invalid email or password credentials.', status: 401 };
  }

  const isMatch = bcrypt.compareSync(password, tutor.passwordHash);
  if (!isMatch) {
    return { error: 'Invalid email or password credentials.', status: 401 };
  }

  const token = jwt.sign(
    { tutorId: tutor.id },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  return {
    token,
    tutor: {
      id: tutor.id,
      name: tutor.name,
      email: tutor.email,
      phone: tutor.phone,
      subjects: tutor.subjects,
    },
  };
}

module.exports = { loginTutor };
