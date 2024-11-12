const Journey = require('../models/Journey');

// Helper function for error handling
const handleControllerError = (error, res, message) => {
  console.error(`Journey Controller Error - ${message}:`, error);
  res.status(500).json({ 
    message: message || 'Server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

exports.getUserJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find({ user: req.user.id })
      .sort({ startTime: -1 })
      .lean()
      .exec();

    // Add duration calculation for in-progress journeys
    const journeysWithDuration = journeys.map(journey => ({
      ...journey,
      duration: journey.endTime 
        ? new Date(journey.endTime) - new Date(journey.startTime)
        : Date.now() - new Date(journey.startTime)
    }));

    res.json(journeysWithDuration);
  } catch (error) {
    handleControllerError(error, res, 'Error fetching journeys');
  }
};

exports.createJourney = async (req, res) => {
  try {
    const { startTime, targetHours, fastId } = req.body;

    // Validate required fields
    if (!startTime || !targetHours) {
      return res.status(400).json({ 
        message: 'Start time and target hours are required' 
      });
    }

    // Check for existing journey with same start time
    const existingJourney = await Journey.findOne({
      user: req.user.id,
      startTime: new Date(startTime)
    });

    if (existingJourney) {
      return res.status(409).json({ 
        message: 'Journey already exists for this start time' 
      });
    }

    const newJourney = new Journey({
      user: req.user.id,
      startTime,
      targetHours,
      fastId, // Link to corresponding fast
      status: 'in-progress'
    });

    await newJourney.save();
    res.status(201).json(newJourney);
  } catch (error) {
    handleControllerError(error, res, 'Error creating journey');
  }
};

exports.updateJourney = async (req, res) => {
  try {
    const { id } = req.params;
    const { endTime, completed, notes } = req.body;

    const existingJourney = await Journey.findOne({ 
      _id: id, 
      user: req.user.id 
    });

    if (!existingJourney) {
      return res.status(404).json({ message: 'Journey not found' });
    }

    // Calculate duration if endTime is provided
    const duration = endTime 
      ? new Date(endTime) - new Date(existingJourney.startTime) 
      : existingJourney.duration;

    // Validate duration
    if (duration < 0) {
      return res.status(400).json({ 
        message: 'End time cannot be before start time' 
      });
    }

    const updatedJourney = await Journey.findOneAndUpdate(
      { _id: id, user: req.user.id },
      {
        endTime,
        completed,
        notes,
        duration,
        status: completed ? 'completed' : 'in-progress',
        updatedAt: Date.now()
      },
      { 
        new: true,
        runValidators: true 
      }
    );

    res.json(updatedJourney);
  } catch (error) {
    handleControllerError(error, res, 'Error updating journey');
  }
};

exports.deleteJourney = async (req, res) => {
  try {
    const { id } = req.params;

    const journey = await Journey.findOneAndDelete({ 
      _id: id, 
      user: req.user.id 
    });

    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }

    res.json({ 
      message: 'Journey deleted successfully',
      journeyId: id
    });
  } catch (error) {
    handleControllerError(error, res, 'Error deleting journey');
  }
};