const express = require('express');
const tourController = require('../controllers/userController');
const router = express.Router()

router
  .route('/')
  .get(tourController.getAllUsers)
  .post(tourController.createUsers)

router
  .route('/:id')
  .get(tourController.getUser)
  .patch(tourController.updateUser)
  .delete(tourController.deleteUser)

module.exports = router;