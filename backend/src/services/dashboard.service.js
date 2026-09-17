const { getDatabase } = require('../db/database');

/**
 * Aggregates dashboard metrics for the tutor:
 * - overdueCount, dueTodayCount, upcomingCount
 * - activeStudentsCount
 * - weeklyLessonRatio (completed vs target based on active students)
 */
function getDashboardMetrics(tutorId) {
  const db = getDatabase();

  // Follow-up counts by type (only active / not done)
  const overdueCount = db.prepare(
    "SELECT COUNT(*) as count FROM FollowUps WHERE tutorId = ? AND type = 'Overdue' AND isDone = 0"
  ).get(tutorId).count;

  const dueTodayCount = db.prepare(
    "SELECT COUNT(*) as count FROM FollowUps WHERE tutorId = ? AND type = 'Today' AND isDone = 0"
  ).get(tutorId).count;

  const upcomingCount = db.prepare(
    "SELECT COUNT(*) as count FROM FollowUps WHERE tutorId = ? AND type = 'Upcoming' AND isDone = 0"
  ).get(tutorId).count;

  // Active students count
  const activeStudentsCount = db.prepare(
    "SELECT COUNT(*) as count FROM Students WHERE tutorId = ? AND status = 'Active'"
  ).get(tutorId).count;

  // Weekly lesson ratio — count notes from last 7 days vs target (activeStudents * 3 per week)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

  const completedLessons = db.prepare(
    'SELECT COUNT(*) as count FROM ClassNotes WHERE tutorId = ? AND sessionDate >= ?'
  ).get(tutorId, sevenDaysAgoStr).count;

  // Target: each active student ideally has 3 lessons/week
  const target = activeStudentsCount * 3 || 1;
  const percentage = Math.min(Math.round((completedLessons / target) * 100), 100);

  return {
    data: {
      overdueCount,
      dueTodayCount,
      upcomingCount,
      activeStudentsCount,
      weeklyLessonRatio: {
        completed: completedLessons,
        target,
        percentage,
      },
    },
  };
}

module.exports = { getDashboardMetrics };
