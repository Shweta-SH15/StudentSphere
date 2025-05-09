const express = require('express');
const { sendMessage, getMessages } = require('../controllers/chatController');
// const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/send', sendMessage);
router.get('/messages', getMessages);

module.exports = router;
