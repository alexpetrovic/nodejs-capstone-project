const express = require('express');
const exercisesRouter = express.Router();
const ExercisesController = require('../controllers/exercise.controler');

const exercisesController = new ExercisesController();

exercisesRouter
  .route('/exercises')
  .post(exercisesController.createExerciseForUser);

exercisesRouter.route('/logs').get(exercisesController.getUsersExercises);

module.exports = exercisesRouter;
