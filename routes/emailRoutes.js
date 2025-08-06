const express = require('express');
const router = express.Router();
const {
  handleContactForm,
  handlePrivateAccessForm,
  handlePropertyDetailForm,
} = require('../controllers/emailController');

router.post('/contact', handleContactForm);
router.post('/private-access', handlePrivateAccessForm);
router.post('/property-detail', handlePropertyDetailForm);

module.exports = router;