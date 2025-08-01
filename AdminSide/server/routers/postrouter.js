const express = require('express');
const router = express.Router();
const {
    getPendingPostsFromTest, approvePost, declinePost
} = require('../controllers/postController');

router.get('/pending', getPendingPostsFromTest);
router.patch('/:id/approve', approvePost);
router.delete('/:id/decline', declinePost);


module.exports = router;
