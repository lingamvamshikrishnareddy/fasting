const express = require('express');
const router = express.Router();
const journeyController = require('../controllers/journeyController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', journeyController.getUserJourneys);
router.post('/', journeyController.createJourney);
router.put('/:id', journeyController.updateJourney);
router.delete('/:id', journeyController.deleteJourney);

module.exports = router;