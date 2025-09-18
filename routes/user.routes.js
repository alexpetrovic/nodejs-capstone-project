const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/user.controller');
const exerciseRouter = require('../routes/exercise.routes');

const userController = new UserController();

userRouter
  .route('/')
  .post(userController.createUser)
  .get(userController.getAllUsers);

userRouter.use(
  '/:_id',
  (req, _, next) => {
    req._id = req.params._id;
    next();
  },
  exerciseRouter
);

module.exports = userRouter;
