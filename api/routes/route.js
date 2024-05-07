const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const routeCtrl = require('../controllers/route');

router.get('/', auth, routeCtrl.getAllRoute);
router.post('/', auth, routeCtrl.createYummy);
router.get('/:id', auth, routeCtrl.getOneYummy);
router.put('/:id', auth, routeCtrl.modifyYummy);
router.delete('/:id', auth, routeCtrl.deleteYummy);

module.exports = router;