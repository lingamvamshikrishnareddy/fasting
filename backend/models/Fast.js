const mongoose = require('mongoose');

const FastSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Each fast must be associated with a user
  },
  startTime: {
    type: Date,
    required: true, // Start time is mandatory
  },
  endTime: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false, // Indicates if the fast has been completed
  },
  targetHours: {
    type: Number,
    required: true, // Target hours for fasting are mandatory
  },
  elapsedTime: {
    type: Number,
    default: 0, // Elapsed time starts at 0
  },
  isRunning: {
    type: Boolean,
    default: true, // Indicates if the fast is currently active
  },
});

const Fast = mongoose.model('Fast', FastSchema);

module.exports = Fast;
