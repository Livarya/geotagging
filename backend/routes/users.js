const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');
const { getMe, updateUser, changePassword, getAllUsers, getUserById } = require('../controllers/userController');

router.get('/me', auth, getMe);
router.put('/update', auth, updateUser);
router.put('/change-password', auth, changePassword);
router.get('/', auth, isAdmin, getAllUsers);
router.get('/:id', auth, isAdmin, getUserById);

module.exports = router; 