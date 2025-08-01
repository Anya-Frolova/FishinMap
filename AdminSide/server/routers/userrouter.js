const express = require('express');
const router = express.Router();
const { getAllUsers, loginUser, getUsersWithRank4, upgradeToExpert, keepAsFisherman, getUserById, approveUser, declineUser } = require('../controllers/userController');

router.get('/', getAllUsers);
router.post('/login', loginUser);
router.get('/rank4', getUsersWithRank4);
router.put('/upgrade/:id', upgradeToExpert);
router.put('/keep/:id', keepAsFisherman);
router.get('/:id', getUserById);
router.patch('/:id/approve', approveUser);
router.delete('/:id/decline', declineUser);



module.exports = router;
