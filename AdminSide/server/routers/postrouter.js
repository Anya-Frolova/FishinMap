const express = require('express');
const router = express.Router();
const {
    getPendingPostsFromTest
} = require('../controllers/postController');

router.get('/pending', getPendingPostsFromTest);

module.exports = router;
