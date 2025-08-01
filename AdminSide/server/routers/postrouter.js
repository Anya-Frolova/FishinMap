const express = require('express');
const router = express.Router();
const {
    getPendingPostsFromTest, approvePost, declinePost, assignUsersToTestPosts
} = require('../controllers/postController');

router.get('/pending', getPendingPostsFromTest);
router.patch('/:id/approve', approvePost);
router.delete('/:id/decline', declinePost);
router.patch('/assign-users', assignUsersToTestPosts);



module.exports = router;
