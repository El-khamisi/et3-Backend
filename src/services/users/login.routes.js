const router = require('express').Router();
const { logUser, regUser, logout, resetPassword, reverifyEmail } = require('./login.controller');
const { authN } = require('../../middlewares/authN');

router.post('/login', logUser);
router.post('/signup', regUser);
router.post('/logout', logout);
router.put('/reset-password', authN, resetPassword);

module.exports = router;
