const express = require("express");
const exercisesRouter = express.Router();
const ExercisesController = require("../controllers/exercise.controler");

exercisesRouter
  .route("/exercises")
  .post((req, res) =>
    new ExercisesController().createExerciseForUser(req, res)
  );

exercisesRouter
  .route("/logs")
  .get((req, res) => new ExercisesController().getUsersExercises(req, res));

module.exports = exercisesRouter;
