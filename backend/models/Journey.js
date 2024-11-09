const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number
  },
  targetHours: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Journey', journeySchema);