// backend/routes/guides.js
const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const auth = require('../middleware/auth');

// Get featured guides (top 6)
router.get('/featured', guideController.getFeaturedGuides);

// Get guides with advanced filtering
router.get('/filtered', guideController.getGuidesFiltered);

// Get guides by location
router.get('/by-location', guideController.getGuidesByLocation);

// Get all guides (public)
router.get('/', guideController.getGuides);

// Get guide by ID (public)
router.get('/:guideId', guideController.getGuideById);

// Routes requiring authentication
router.use(auth);

// Submit guide request
router.post('/requests', guideController.submitGuideRequest);

// Get user's guide requests
router.get('/user/requests', guideController.getUserGuideRequests);

// Get guide's requests
router.get('/:guideId/requests', guideController.getGuideRequests);

// Update guide request status
router.put('/requests/:requestId', guideController.updateGuideRequestStatus);

module.exports = router;
