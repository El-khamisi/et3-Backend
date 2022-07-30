const router = require('express').Router();

const { authN } = require('../../middlewares/authN');
const { isAdmin } = require('../../middlewares/authZ');
const { getAllCoffee, getOneCoffee, createCoffe, updateCoffee, deleteCoffee } = require('./controller');

//Public Routes
router.get('/coffee', getAllCoffee);
router.get('/coffee/:id', getOneCoffee);

router.post('/coffee', authN, isAdmin, createCoffe);
router.put('/coffee/:id', authN, isAdmin, updateCoffee);
router.delete('/coffee/:id', authN, isAdmin, deleteCoffee);

module.exports = router;
