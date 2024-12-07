const express = require('express');
const { handleRefreshToken } = require('../controllers/refresh-token');

const router = express.Router();

router.get('/', handleRefreshToken);

module.exports = router;