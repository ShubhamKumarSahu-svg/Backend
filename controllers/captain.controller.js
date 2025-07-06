const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullname: { firstname, lastname },
    email,
    password,
  } = req.body;

  const isAlreadyCaptain = await captainModel.findOne({ email });
  if (isAlreadyCaptain) {
    return res.status(400).json({ message: 'Captain already exists' });
  }

  const hashedPassword = await captainModel.hashPassword(password);

  const captainData = {
    fullname: { firstname, lastname },
    email,
    password: hashedPassword,
    vehicle: {
      color: req.body.vehicle.color,
      plate: req.body.vehicle.plate,
      capacity: req.body.vehicle.capacity,
      type: req.body.vehicle.type,
    },
  };

  const captain = await captainService.createCaptain(captainData);

  if (!captain) {
    return res.status(500).json({ message: 'Failed to create captain' });
  }

  const token = captain.generateAuthToken();

  res.status(201).json({ token, captain });
};
