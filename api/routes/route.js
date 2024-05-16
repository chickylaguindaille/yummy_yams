const express = require('express');
const router = express.Router();

const middleware = require('../middleware/auth');

const routeCtrl = require('../controllers/route');

router.get('/', middleware.auth, routeCtrl.getAllRoute);
router.post('/', middleware.auth, routeCtrl.createYummy);
router.get('/:id', middleware.auth, routeCtrl.getOneYummy);
router.put('/:id', routeCtrl.modifyYummy);
router.delete('/:id', middleware.auth, routeCtrl.deleteYummy);

module.exports = router;