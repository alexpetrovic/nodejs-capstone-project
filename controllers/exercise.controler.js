const query = require('../constants/query.constants');
const message = require('../constants/message.constants');
const db = require('../database');

class ExercisesController {
  createExerciseForUser = (req, res) => {
    const { description, duration, date } = req.body;
    const userId = req._id;

    if (!description && !duration) {
      return res
        .status(400)
        .json({ error: message.DESCRIPTION_AND_DURATION_REQUIRED });
    }
    if (!description) {
      return res.status(400).json({ error: message.DESCRIPTION_REQUIRED });
    }

    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      return res
        .status(400)
        .json({ error: message.DURATION_MUST_BE_POSITIVE_NUMBER });
    }

    const exerciseDate = date
      ? new Date(date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);
    if (isNaN(new Date(exerciseDate))) {
      return res.status(400).json({ error: message.INVALID_DATE });
    }

    db.run(
      query.INSERT_INTO_EXERCISES,
      [userId, description, parsedDuration, exerciseDate],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({
          userId,
          _id: this.lastID,
          description,
          duration: parsedDuration,
          date: exerciseDate,
        });
      }
    );
  };

  getUsersExercises = (req, res) => {
    const userId = req._id;
    const { from, to, limit } = req.query;

    let newQuery = query.SELECT_EXERCISES_BY_USER_ID;
    const params = [userId];
    const whereClauses = [];

    if (from) {
      whereClauses.push('date >= ?');
      params.push(from);
    }
    if (to) {
      whereClauses.push('date <= ?');
      params.push(to);
    }

    if (whereClauses.length > 0) {
      newQuery += ' AND ' + whereClauses.join(' AND ');
    }

    newQuery += ' ORDER BY date ASC';
    if (limit) {
      newQuery += ' LIMIT ?';
      params.push(limit);
    }

    db.all(newQuery, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.get(
        query.COUNT_EXERCISES_BY_USER_ID,
        [userId],
        (countErr, countRow) => {
          if (countErr) {
            return res.status(500).json({ error: countErr.message });
          }

          const count = countRow.count || 0;
          res.json({ userId, logs: rows, count: count });
        }
      );
    });
  };
}

module.exports = ExercisesController;
