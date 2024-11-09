const Journey = require('../models/Journey');

exports.getUserJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find({ user: req.user.id }).sort({ startTime: -1 });
    res.json(journeys);
  } catch (error) {
    console.error('Error fetching journeys:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createJourney = async (req, res) => {
  try {
    const { startTime, targetHours } = req.body;
    const newJourney = new Journey({
      user: req.user.id,
      startTime,
      targetHours
    });
    await newJourney.save();
    res.status(201).json(newJourney);
  } catch (error) {
    console.error('Error creating journey:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateJourney = async (req, res) => {
  try {
    const { id } = req.params;
    const { endTime, completed, notes } = req.body;
    const journey = await Journey.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { endTime, completed, notes, duration: endTime - journey.startTime },
      { new: true }
    );
    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }
    res.json(journey);
  } catch (error) {
    console.error('Error updating journey:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteJourney = async (req, res) => {
  try {
    const { id } = req.params;
    const journey = await Journey.findOneAndDelete({ _id: id, user: req.user.id });
    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }
    res.json({ message: 'Journey deleted successfully' });
  } catch (error) {
    console.error('Error deleting journey:', error);
    res.status(500).json({ message: 'Server error' });
  }
};