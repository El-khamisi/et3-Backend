const router = require('express').Router();

const { authN } = require('../../middlewares/authN');
const { isAdmin } = require('../../middlewares/authZ');
const { getUsers, getUser, addUser, updateUser, deleteUser } = require('../user/user.controllers');

//Users
router.get('/users', authN, isAdmin, getUsers);
router.get('/user/:id', authN, isAdmin, getUser);
router.post('/user', authN, isAdmin, addUser);
router.put('/user/:id', authN, isAdmin, updateUser);
router.delete('/user/:id', authN, isAdmin, deleteUser);

module.exports = router;
