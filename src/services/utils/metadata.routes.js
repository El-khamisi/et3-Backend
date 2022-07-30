const router = require('express').Router();
const { levels, memberships, subscriptions, categories } = require('../../config/public_config');
const { successfulRes } = require('../../utils/response');

router.get('/metadata', (req, res) => {
  successfulRes(res, 200, { levels, memberships, subscriptions, categories });
});

module.exports = router;
