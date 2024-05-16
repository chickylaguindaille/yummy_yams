const express = require('express');
const router = express.Router();

const middleware = require('../middleware/auth');

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/', middleware.auth, userCtrl.getAllUser);
router.get('/:id', middleware.auth, userCtrl.getOneUser);
router.put('/:id', middleware.auth, userCtrl.modifyUser);
router.delete('/:id', middleware.auth, userCtrl.deleteUser);

module.exports = router;