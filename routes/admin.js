const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const adminController = require('../controllers/adminController');


router.get('/admin/pending-requests', ensureAuthenticated, adminController.getPendingRequests);
router.put('/admin/approve-professor-request/:requestId', ensureAuthenticated, adminController.approveProfessorRequest);

module.exports = router;