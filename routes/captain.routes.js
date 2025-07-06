const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller');

router.post(
  '/register',
  [
    body('fullname.firstname')
      .isLength({ min: 3 })
      .withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('vehicle.color')
      .isLength({ min: 3 })
      .withMessage('Vehicle color must be at least 3 characters long'),
    body('vehicle.plate')
      .isLength({ min: 3 })
      .withMessage('Vehicle plate must be at least 3 characters long'),
    body('vehicle.capacity')
      .isInt({ gt: 0 })
      .withMessage('Vehicle capacity must be greater than 0'),
    body('vehicle.type').notEmpty().withMessage('Vehicle type is required'),
  ],
  captainController.registerCaptain
);

module.exports = router;
